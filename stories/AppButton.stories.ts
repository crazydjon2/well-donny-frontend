import type { Meta, StoryObj } from "@nuxtjs/storybook";
import AppButton from "../components/ui/AppButton.vue";
import { ButtonTypes } from "~/assets/types/ui";

const meta = {
  title: "UI",
  component: AppButton,
  tags: ["autodocs"],
} satisfies Meta<typeof AppButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppButtons: Story = {
  render: () => ({
    components: { AppButton },
    template: `
      <div class="mx-auto flex items-center gap-4 max-w-[600px]">
        <div class="flex justify-center flex-col gap-2 w-full">
          <AppButton type="${ButtonTypes.PRIMARY}" :full="false"></AppButton>
          <AppButton type="${ButtonTypes.SECONDARY}" :full="false"></AppButton>
          <AppButton type="${ButtonTypes.SECONDARY}" :full="false" disabled></AppButton>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <AppButton type="${ButtonTypes.PRIMARY}" :full="true"></AppButton>
          <AppButton type="${ButtonTypes.SECONDARY}" :full="true"></AppButton>
          <AppButton type="${ButtonTypes.PRIMARY}" :full="true" disabled></AppButton>
        </div
      </div>
    `,
  }),
};
