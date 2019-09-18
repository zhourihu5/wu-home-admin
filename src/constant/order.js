// 活动 订单常量
export const order = {
    // 状态 
    status: [
        {
            label: "不限",
            value: "0"
        },
        {
            label: "待付款",
            value: "1"
        },
        {
            label: "待收货",
            value: "2"
        },
        {
            label: "已收货",
            value: "3"
        },
        {
            label: "已过期",
            value: "4"
        },
        {
            label: "配送中",
            value: "5"
        }
    ],
    // 类型
    types: [
        {
            label: "余额支付",
            value: "1"
        },
        {
            label: "支付宝支付",
            value: "2"
        },
        {
            label: "网银支付",
            value: "3"
        },
        {
            label: "微信支付",
            value: "4"
        },
    ]
}