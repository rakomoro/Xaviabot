const config = {
    name: "المكونات",
    aliases: ["pl", "plg", "plugin"],
    description: "Manage plugins",
    usage: "[reload]/[list]",
    permissions: [2],
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "result.reload": "تمت اعادة تحميل المكونات.",
        "result.list": "Commands: {commands}\nEvents: {events}\nOnMessage: {onMessage}\nCustoms: {customs}",
        "invalid.query": "Invalid query!",
        "error.unknow": "حدث خطأ، تحقق من وحدة التحكم لمزيد من التفاصيلحدث خطأ، تحقق من وحدة التحكم لمزيد من التفاصيل"
    },
    "vi_VN": {
        "result.reload": "Đã tải lại toàn bộ plugin, kiểm tra console để biết thêm chi tiết",
        "result.list": "Lệnh: {commands}\nSự kiện: {events}\nTrình xử lý tin nhắn: {onMessage}\nTùy chỉnh: {customs}",
        "invalid.query": "Lệnh không hợp lệ!",
        "error.unknow": "Đã xảy ra lỗi, kiểm tra console để biết thêm chi tiết"
    }
}

async function onCall({ message, args, getLang }) {
    try {
        const query = args[0]?.toLowerCase();
        if (query === "reload") {
            delete global.plugins;
            global.plugins = new Object({
                commands: new Map(),
                commandsAliases: new Map(),
                commandsConfig: new Map(),
                customs: new Number(0),
                events: new Map(),
                onMessage: new Map()
            });

            for (const lang in global.data.langPlugin) {
                for (const plugin in global.data.langPlugin[lang]) {
                    if (plugin == config.name) continue;
                    delete global.data.langPlugin[lang][plugin];
                }
            }

            delete global.data.temps;
            global.data.temps = new Array();

            await global.modules.get("loader").loadPlugins();
            return message.reply(getLang("result.reload"));
        } else if (query == 'list') {
            return message.reply(getLang("result.list", {
                commands: global.plugins.commands.size,
                events: global.plugins.events.size,
                onMessage: global.plugins.onMessage.size,
                customs: global.plugins.customs
            }));
        } else {
            message.reply(getLang("invalid.query"));
        }
    } catch (e) {
        console.error(e);
        message.reply(getLang("error.unknow"));
    }
}

export default {
    config,
    langData,
    onCall
}
