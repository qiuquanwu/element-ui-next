import { defineComponent} from "vue";

const ElLink = defineComponent({
  name: "ElLink",
  props: {
    type: {
      type: String,
      default: "default"
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: String,
    icon: String,
  },
  setup(props, { attrs, slots }) {
    // const eventBus = new EventBus()
    // const handleClick = (event) => {
    //   if (!props.disabled) {
    //     if (!props.href) {
    //       eventBus.emit("click", event);
    //     }
    //   }
    // };
    return () => (
      <a class={[
        "el-link",
        props.type ? `el-link--${props.type}` : "",
        props.disabled && "is-disabled",
        props.underline && !props.disabled && "is-underline"
      ]}
         href={props.disabled ? undefined : props.href}
         {...attrs}
      >

        {props.icon && <i class={props.icon}></i>}
        {slots.default && <span class="el-link--inner">{slots.default?.(`name:${props.icon}`)}</span>}
        {slots.icon && slots.default?.(`name:${props.icon}`)}
      </a>
    );
  }
});

export default ElLink;
