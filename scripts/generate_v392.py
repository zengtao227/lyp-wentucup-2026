"""
Generate 决赛版-v3.9.2-Chatflow.yml from v3.9 (Path B: LLM node, no Agent plugin).

Architecture change: Simplify 分类7 chain without requiring the Agent strategy plugin.

Changes vs v3.9 booking chain (分类7):
  REMOVED (4): OLD_TMPL1 + OLD_PE_DATES + OLD_TMPL2 + OLD_PE_BOOK
  ADDED   (3): NEW_TMPL + NEW_PE_ALL + NEW_KB
  MODIFIED: OLD_LLM (enable KB context, qwen-plus), variable selectors in
            GET_ROOMS / CODE_PRICE / IFELSE_SUBMIT / SUBMIT_TOOL / SUCCESS_ANS
  NET: -1 node; no Agent plugin required; fully compatible with Dify 1.x

New chain (false branch):
  ...time → NEW_TMPL → NEW_PE_ALL → GET_ROOMS → CODE_PRICE → IFELSE_SUBMIT
    ↘ false → NEW_KB → OLD_LLM (with KB context) → OLD_ANSWER
    ↘ true  → submitBooking chain (unchanged)
"""

import yaml
import copy
import sys
import os

SRC = "/Users/zengtao/Doc/My code/lyp-wentucup/dify-workflows/决赛版-v3.9-Chatflow.yml"
DST = "/Users/zengtao/Doc/My code/lyp-wentucup/dify-workflows/决赛版-v3.9.2-Chatflow.yml"

# ── IDs ──────────────────────────────────────────────────────────────────────
OLD_TMPL1     = "1779100000001"   # template-transform 订房参数上下文
OLD_PE_DATES  = "1779100000002"   # parameter-extractor dates only
OLD_TMPL2     = "1779200000005"   # template-transform 提交参数
OLD_PE_BOOK   = "1779200000006"   # parameter-extractor booking params

NEW_TMPL      = "1779300000001"   # simplified template-transform
NEW_PE_ALL    = "1779300000002"   # combined param-extractor (all 7 fields)
NEW_KB        = "1779300000003"   # knowledge-retrieval

CURRENT_TIME  = "1779049137062"   # 获取当前时间
GET_ROOMS     = "1778843661327"   # getAvailableRoomsByDate
CODE_PRICE    = "1779200000010"   # Code: 匹配价格计划
IFELSE_SUBMIT = "1779200000011"   # if-else: 是否具备提交条件
SUBMIT_TOOL   = "1779200000007"   # submitBooking
OLD_LLM       = "1776900001000"   # 客房预订 LLM (kept, gets KB context)
SUCCESS_ANS   = "1779200000016"   # 预订成功回复

NODES_TO_REMOVE = {OLD_TMPL1, OLD_PE_DATES, OLD_TMPL2, OLD_PE_BOOK}


# ── New node definitions ──────────────────────────────────────────────────────

def new_template_transform():
    return {
        "data": {
            "selected": False,
            "template": "当前日期时间（Asia/Shanghai）：{{ current_time }}\n用户当前消息：{{ user_query }}\n",
            "title": "订房上下文",
            "type": "template-transform",
            "variables": [
                {"value_selector": [CURRENT_TIME, "text"], "variable": "current_time"},
                {"value_selector": ["sys", "query"],       "variable": "user_query"},
            ],
        },
        "height": 54,
        "id": NEW_TMPL,
        "position": {"x": 936, "y": 1201.5},
        "positionAbsolute": {"x": 936, "y": 1201.5},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 242,
    }


def new_combined_param_extractor():
    instruction = (
        "从输入文本和最近10轮对话历史中提取以下7个字段：\n\n"
        "1. checkInDate：入住日期，YYYY-MM-DD。"
        "以输入文本中的「当前日期时间」为参考，解析今天/今晚/明天/后天/本周末等相对日期；"
        "年份不明时使用2026年；未说离店日期时默认住1晚；无法判断时输出空字符串。\n\n"
        "2. checkOutDate：离店日期，YYYY-MM-DD。规则同上；无法判断时输出空字符串。\n\n"
        "3. roomCode：客人在对话中选定的房型代码（如001/002/004）。"
        "只从历史对话的明确选择或确认中提取；找不到时输出空字符串，不要猜测。\n\n"
        "4. number：预订间数，默认1。\n\n"
        "5. name：宾客姓名；找不到时输出空字符串。\n\n"
        "6. mobile：宾客手机号（11位数字）；找不到时输出空字符串。\n\n"
        "7. email：宾客邮箱；未提供时输出 guest@example.com。\n\n"
        "严禁提取或编造 rateCode、verifyId、verifyIds；这些字段由后续 Code 节点自动确定。\n"
        "若对话中找不到 roomCode 或 mobile，对应字段返回空字符串，不要猜测。"
    )
    return {
        "data": {
            "instruction": instruction,
            "memory": {
                "query_prompt_template": "{{#sys.query#}}\n\n{{#sys.files#}}",
                "role_prefix": {"assistant": "", "user": ""},
                "window": {"enabled": True, "size": 10},
            },
            "model": {
                "completion_params": {"temperature": 0.1},
                "mode": "chat",
                "name": "qwen-plus",
                "provider": "langgenius/tongyi/tongyi",
            },
            "parameters": [
                {"description": "入住日期，YYYY-MM-DD格式；无法判断时为空字符串。",
                 "name": "checkInDate", "required": True, "type": "string"},
                {"description": "离店日期，YYYY-MM-DD格式；无法判断时为空字符串。",
                 "name": "checkOutDate", "required": True, "type": "string"},
                {"description": "房型代码，如001/002/005；对话中找不到时返回空字符串。",
                 "name": "roomCode", "required": True, "type": "string"},
                {"description": "预订间数，默认1。",
                 "name": "number", "required": True, "type": "number"},
                {"description": "宾客姓名；找不到时返回空字符串。",
                 "name": "name", "required": True, "type": "string"},
                {"description": "宾客手机号；找不到时返回空字符串。",
                 "name": "mobile", "required": True, "type": "string"},
                {"description": "宾客邮箱；未提供时输出 guest@example.com。",
                 "name": "email", "required": True, "type": "string"},
            ],
            "query": [NEW_TMPL, "output"],
            "reasoning_mode": "prompt",
            "selected": False,
            "title": "预订参数提取",
            "type": "parameter-extractor",
            "vision": {"enabled": False},
        },
        "height": 88,
        "id": NEW_PE_ALL,
        "position": {"x": 1238, "y": 1201.5},
        "positionAbsolute": {"x": 1238, "y": 1201.5},
        "selected": False,
        "sourcePosition": "right",
        "targetPosition": "left",
        "type": "custom",
        "width": 242,
    }


def new_kb_retrieval(src_nodes):
    """Clone structure from an existing KB node in v3.9 to guarantee format compatibility."""
    existing = next(n for n in src_nodes if n["data"].get("type") == "knowledge-retrieval")
    node = copy.deepcopy(existing)
    node["id"] = NEW_KB
    node["data"]["title"] = "酒店知识检索"
    node["data"]["query_variable_selector"] = ["sys", "query"]
    node["data"]["selected"] = False
    node["position"] = {"x": 1842, "y": 1540}
    node["positionAbsolute"] = {"x": 1842, "y": 1540}
    node["height"] = 84
    node["selected"] = False
    return node


def make_edge(src, src_handle, tgt, src_type, tgt_type):
    sid = f"{src}-{src_handle}-{tgt}-target"
    return {
        "data": {
            "isInIteration": False,
            "isInLoop": False,
            "sourceType": src_type,
            "targetType": tgt_type,
        },
        "id": sid,
        "source": src,
        "sourceHandle": src_handle,
        "target": tgt,
        "targetHandle": "target",
        "type": "custom",
        "zIndex": 0,
    }


# ── Transform ─────────────────────────────────────────────────────────────────

def transform(data):
    wf = data["workflow"]["graph"]
    src_nodes = wf["nodes"]   # snapshot before any removals

    data["app"]["name"] = "决赛版-v3.9.2-Chatflow"
    data["app"]["description"] = (
        "2026问途杯决赛版 v3.9.2。基于v3.9，将分类7（客房预订）的双PE+双模板链路"
        "精简为单一combined PE（提取全部7字段）+知识库检索注入客房预订LLM。"
        "无需Agent策略插件，完全兼容Dify 1.x。"
        "FALSE分支: 11→8节点；TRUE分支: 13→11节点。"
    )

    # ── Edges ────────────────────────────────────────────────────────────────
    edges = wf["edges"]

    pairs_to_remove = {
        (CURRENT_TIME,  OLD_TMPL1),
        (OLD_TMPL1,     OLD_PE_DATES),
        (OLD_PE_DATES,  GET_ROOMS),
        (GET_ROOMS,     OLD_TMPL2),
        (OLD_TMPL2,     OLD_PE_BOOK),
        (OLD_PE_BOOK,   CODE_PRICE),
        (IFELSE_SUBMIT, OLD_LLM),      # false branch
    }
    wf["edges"] = [
        e for e in edges
        if (e.get("source"), e.get("target")) not in pairs_to_remove
    ]

    new_edges = [
        make_edge(CURRENT_TIME,  "source",  NEW_TMPL,    "tool",                 "template-transform"),
        make_edge(NEW_TMPL,      "source",  NEW_PE_ALL,  "template-transform",   "parameter-extractor"),
        make_edge(NEW_PE_ALL,    "source",  GET_ROOMS,   "parameter-extractor",  "tool"),
        make_edge(GET_ROOMS,     "source",  CODE_PRICE,  "tool",                 "code"),
        make_edge(IFELSE_SUBMIT, "false",   NEW_KB,      "if-else",              "knowledge-retrieval"),
        make_edge(NEW_KB,        "source",  OLD_LLM,     "knowledge-retrieval",  "llm"),
    ]
    wf["edges"].extend(new_edges)

    # ── Nodes ────────────────────────────────────────────────────────────────
    wf["nodes"] = [n for n in wf["nodes"] if n["id"] not in NODES_TO_REMOVE]

    for n in wf["nodes"]:
        nid = n["id"]

        if nid == GET_ROOMS:
            for param_val in n["data"].get("tool_parameters", {}).values():
                if param_val.get("type") == "variable":
                    vs = param_val.get("value", [])
                    if vs and vs[0] == OLD_PE_DATES:
                        vs[0] = NEW_PE_ALL

        elif nid == CODE_PRICE:
            for v in n["data"].get("variables", []):
                if v["value_selector"][0] in (OLD_PE_DATES, OLD_PE_BOOK):
                    v["value_selector"][0] = NEW_PE_ALL

        elif nid == IFELSE_SUBMIT:
            for case in n["data"].get("cases", []):
                for cond in case.get("conditions", []):
                    vs = cond.get("variable_selector", [])
                    if vs and vs[0] == OLD_PE_BOOK:
                        vs[0] = NEW_PE_ALL

        elif nid == SUBMIT_TOOL:
            for param_val in n["data"].get("tool_parameters", {}).values():
                if param_val.get("type") == "variable":
                    vs = param_val.get("value", [])
                    if vs and vs[0] == OLD_PE_BOOK:
                        vs[0] = NEW_PE_ALL

        elif nid == SUCCESS_ANS:
            ans = n["data"].get("answer", "")
            ans = ans.replace(f"{{{{#{OLD_PE_DATES}.checkInDate#}}}}",
                              f"{{{{#{NEW_PE_ALL}.checkInDate#}}}}")
            ans = ans.replace(f"{{{{#{OLD_PE_DATES}.checkOutDate#}}}}",
                              f"{{{{#{NEW_PE_ALL}.checkOutDate#}}}}")
            n["data"]["answer"] = ans

        elif nid == OLD_LLM:
            n["data"]["context"] = {
                "enabled": True,
                "variable_selector": [NEW_KB, "result"],
            }
            n["data"]["model"]["name"] = "qwen-plus"

    wf["nodes"].extend([
        new_template_transform(),
        new_combined_param_extractor(),
        new_kb_retrieval(src_nodes),
    ])

    return data


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    with open(SRC, "r", encoding="utf-8") as f:
        raw = f.read()

    data = yaml.safe_load(raw)
    data = transform(data)

    with open(DST, "w", encoding="utf-8") as f:
        yaml.dump(data, f, allow_unicode=True, sort_keys=False,
                  default_flow_style=False, width=120)

    print(f"Written: {DST}")
    with open(DST, "r", encoding="utf-8") as f:
        check = yaml.safe_load(f)
    node_ids = {n["id"] for n in check["workflow"]["graph"]["nodes"]}
    edge_ids = [e["id"] for e in check["workflow"]["graph"]["edges"]]
    print(f"Nodes: {len(node_ids)}, Edges: {len(edge_ids)}")
    for removed in NODES_TO_REMOVE:
        assert removed not in node_ids, f"Node {removed} not removed!"
    for new_id in (NEW_TMPL, NEW_PE_ALL, NEW_KB):
        assert new_id in node_ids, f"Node {new_id} not added!"
    assert OLD_LLM in node_ids, "OLD_LLM must be retained!"
    # Verify LLM has KB context enabled
    llm_node = next(n for n in check["workflow"]["graph"]["nodes"] if n["id"] == OLD_LLM)
    assert llm_node["data"]["context"]["enabled"], "OLD_LLM context not enabled!"
    print("All sanity checks passed.")


if __name__ == "__main__":
    main()
