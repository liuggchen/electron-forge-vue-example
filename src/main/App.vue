<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Whatsapp</router-link>
            |
            <router-link to="/about">About</router-link>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        created() {
            for (let key in $electron.toolInfo) {
                console.log("%s: %s", key, $electron.toolInfo[key])
            }
        }
    }
</script>

<style lang="scss">
    html, body, #app {
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        box-sizing: border-box;
        padding: 10px;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
