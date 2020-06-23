<template>
  <div class="radio">
    <h3>radio</h3>
    <div>
      <!--      <el-radio-group v-model="radio">-->
      <el-radio ref="rd" v-model="radio" label="1" @changeValue="change">1号</el-radio>
      <el-radio v-model="radio" label="2" @changeValue="change">2号</el-radio>
      <!--      </el-radio-group>-->
    </div>
    <div>
      <el-radio-group @changeValue="change_2" v-model="radio2">
        <el-radio label="1">1号</el-radio>
        <el-radio label="2">2号</el-radio>
      </el-radio-group>
    </div>
    <el-button @click="btnChange">点击切换</el-button>

    <div style="margin-top: 20px">
      <el-radio-group v-model="local" @changeValue="change_local">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="local" size="medium">
        <el-radio-button label="上海" ></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="local" size="small">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京" disabled ></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="local" disabled size="mini">
        <el-radio-button label="上海"></el-radio-button>
        <el-radio-button label="北京"></el-radio-button>
        <el-radio-button label="广州"></el-radio-button>
        <el-radio-button label="深圳"></el-radio-button>
      </el-radio-group>
    </div>

    <div style="margin-top: 20px">
      <el-radio v-model="radio" label="1" border>备选项1</el-radio>
      <el-radio v-model="radio" label="2" border>备选项2</el-radio>
    </div>
    <div style="margin-top: 20px">
      <el-radio v-model="radio2" label="1" border size="medium">备选项1</el-radio>
      <el-radio v-model="radio2" label="2" border size="medium">备选项2</el-radio>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio3" size="small">
        <el-radio label="1" border>备选项1</el-radio>
        <el-radio label="2" border disabled>备选项2</el-radio>
      </el-radio-group>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio4" size="mini" disabled>
        <el-radio label="1" border>备选项1</el-radio>
        <el-radio label="2" border>备选项2</el-radio>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
  import {ref, onMounted} from 'vue'
  import ElRadio from '../../packages/radio/src/radio'
  import ElButton from "../../packages/button/src/button"

  export default {
    name: 'Radio',
    components: {ElButton, ElRadio},
    setup() {
      const rd = ref()
      onMounted(() => {
        debugger
        console.log('rd:', rd.value)
      })
      const radio = ref('1')
      const radio2 = ref('1')
      const radio3 = ref('1')
      const radio4 = ref('1')
      const local = ref('上海')
      /*  watchEffect(() => {
          console.log('curRadio:' + radio.value)
        })*/
      return {
        radio,
        radio2,
        radio3,
        radio4,
        local,
        change(value) {
          console.log('[raido]:', value)
        },
        change_2(value) {
          console.log('[raido_2]:', value)
        },
        change_local (value) {
          console.log('[raido_local]:', value)
        },
        btnChange() {
          radio2.value = radio2.value === '1' ? '2' : '1'
        }
      }
    }
  }
</script>
