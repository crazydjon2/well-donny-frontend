import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AppIcon from "../components/ui/AppIcon.vue";
import { ref } from "vue";

const meta = {
  title: "UI",
  component: AppIcon,
  tags: ["autodocs"],
} satisfies Meta<typeof AppIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppIcons: Story = {
  args: {
    icon: "refresh",
  },
  render: (args) => ({
    components: { AppIcon },
    setup() {
      const icons = import.meta.glob("@/assets/icons/*.svg", { eager: true });
      const iconFileNames = Object.keys(icons)
        .map((path) => {
          return path.split("/").pop(); // get filename from path
        })
        .map((fileName) => fileName?.replace(".svg", ""));

      const selectedIcon = ref(args.icon);
      selectedIcon.value = args.icon;

      return { iconFileNames, selectedIcon };
    },
    template: `
      <div>
        <label for="icon-select">Select icon:</label>
        <select id="icon-select" v-model="selectedIcon">
          <option v-for="icon in iconFileNames" :key="icon" :value="icon">{{ icon }}</option>
        </select>
      </div>
      <div class="mx-auto flex items-center gap-4 max-w-[600px]">
        <div class="flex justify-center flex-col gap-2 w-full">
        <AppIcon :icon="selectedIcon" small></AppIcon>
        <AppIcon :icon="selectedIcon"></AppIcon>
        <AppIcon :icon="selectedIcon" width="60" height="60"></AppIcon>
        </div>
        <div class="flex justify-center flex-col gap-2 w-full">
          <AppIcon :icon="selectedIcon" small color="text-primary"></AppIcon>
          <AppIcon :icon="selectedIcon" color="text-primary"></AppIcon>
          <AppIcon :icon="selectedIcon" width="60" height="60" color="text-primary"></AppIcon>
        </div>
          <div class="flex justify-center flex-col gap-2 w-full">
          <AppIcon :icon="selectedIcon" small color="text-secondary"></AppIcon>
          <AppIcon :icon="selectedIcon" color="text-secondary"></AppIcon>
          <AppIcon :icon="selectedIcon" width="60" height="60" color="text-secondary"></AppIcon>
        </div>
      </div>
    `,
  }),
};
