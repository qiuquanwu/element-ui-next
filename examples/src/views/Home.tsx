import { defineComponent, reactive } from "vue";
import {ElContainer, ElMain, ElHeader, ElAside, ELAvatar} from "../../../packages/index"
import CHeader from "../components/layout/cHeader"
import CAside from "../components/layout/cAside"

import "./Home.scss"

export default defineComponent({
  name: "App",
  setup() {
    const state = reactive({
      fits: ["fill", "contain", "cover", "none", "scale-down"],
      url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
    })
    const demoAvatar = () => {
      return state.fits.map(e => {
        return <ELAvatar shape="square" fit={e} size={100} src={state.url} style="margin-right: 30px"></ELAvatar>
      })
    }
    return () => (
      <ElContainer class="element-ui-next">
        <ElHeader height="80px">
          <CHeader/>
        </ElHeader>
        <ElContainer>
          <ElAside style="text-align: left;" width="400px">
            <CAside/>
          </ElAside>
          <ElMain>
            {demoAvatar()}
          </ElMain>
        </ElContainer>
      </ElContainer>
    );
  }
});