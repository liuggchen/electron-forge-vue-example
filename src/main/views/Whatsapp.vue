<template>
    <div class="home">
        <div class="whatsapp-container">
            <el-button :loading="btnLoading" @click="callStartWP">开始同步</el-button>
            <img class="qr-img" v-if="qrCodeImg && !loginSuccess" :src="qrCodeImg" alt="使用whatsapp扫码登录"/>
            <div ref="log-container" v-show="loginSuccess" class="log-container">
                <ul class="log-list">
                    <li class="log-item" v-for="log of logList">[{{log.type}}] {{log.ts}} {{log.msg}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import jrQrcode from 'jr-qrcode'

    export default {
        name: 'Whatsapp',
        data() {
            return {
                btnLoading: false,
                loginSuccess: true,
                qrCodeImg: undefined,
                logList: [
                    // {type: 'info', msg: '登录成功', ts: '12:30:45'},
                    // {type: 'info', msg: '登录成功', ts: '12:30:46'}
                ]
            }
        },
        created() {
            window.onmessage = (event) => {
                if (event.source === window && event.data) {
                    console.log(event.data)
                    switch (event.data.type) {
                        case 'qrcode':
                            this.qrCodeImg = jrQrcode.getQrBase64(event.data.message, {width: 400, height: 400})
                            break
                        case 'login_success':
                            this.$message.success('登录成功')
                            this.loginSuccess = true
                            break
                        case 'login_fail':
                            this.$message.error('登录失败')
                            this.btnLoading = false
                            break;
                        case 'complete':
                            this.btnLoading = false
                            this.writeLog('info', event.data.message, event.data.timestamp)
                            break;
                        case 'disconnected':
                            this.$message.warning('连接断开')
                            break
                        case 'msg':
                            this.writeLog('info', event.data.message, event.data.timestamp)
                            break;
                        default:
                            console.log(event.data)
                    }
                }
            }
        },
        methods: {
            callStartWP() {
                this.btnLoading = true
                this.loginSuccess = false
                this.qrCodeImg = undefined
                this.logList = []
                $electron.startWp()
            },
            writeLog(type, msg, timestamp) {
                this.logList.push({type, msg, ts: this.$moment.unix(timestamp).format('HH:mm:ss')})
            }
        }
    }
</script>
<style lang="scss">
    .whatsapp-container {
        margin: 0 auto;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .qr-img {
            width: 400px;
            height: 400px;
            flex: none;
        }
    }

    .log-container {
        width: 100%;
        //height: 400px;
        flex: 1;
        padding: 10px;
        box-sizing: border-box;

        .log-list {
            list-style: none;
            margin: 0;
            padding: 0;

            .log-item {
                margin: 0 0 5px 0;
                padding: 0;
                text-align: left;
                font-size: 13px;
            }
        }
    }
</style>
