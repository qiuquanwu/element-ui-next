import { App, Plugin } from "vue";
import ElButton from "./button/index";
import ElButtonGroup from "./buttonGroup/index";
import ElAside from "./aside/index";
import ElContainer from "./container/index";
import ElFooter from "./footer/index";
import ElHeader from "./header/index";
import ElIcon from "./icon/index";
import ElMain from "./main/index";
import ELAvatar from "./avatar/index";
import ELlink from "./link/index";
import ELTag from "./tag/index";
import ElCard from "./card/index";

import { ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup } from "./menu/index";

const components = [
  ElButton,
  ElButtonGroup,
  ElAside,
  ElContainer,
  ElFooter,
  ElHeader,
  ElIcon,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ELAvatar,
  ElMenuItemGroup,
  ELlink,
  ELTag,
  ElCard,
];

const install = function (Vue: App): void {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

const elementUiNext: Plugin = {
  install,
};

export default elementUiNext;

export {
  ElButton,
  ElButtonGroup,
  ElAside,
  ElContainer,
  ElFooter,
  ElHeader,
  ElIcon,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ELAvatar,
  ElMenuItemGroup,
  ELlink,
  ELTag,
  ElCard,
};
