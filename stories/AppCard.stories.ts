import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AppCard from '~/components/AppCard.vue'

const meta = {
  title: 'UI',
  component: AppCard,
  tags: ['autodocs'],
} satisfies Meta<typeof AppCard>

export default meta
type Story = StoryObj<typeof meta>

export const CardStory: Story = {
  args: {
    textFirst: 'AAA',
    textSecond: 'BBB',
  },
  render: () => ({
    components: { AppCard },
    template: `
      <div class="mx-auto flex items-center gap-4 max-w-[500px]">
        <div class="flex justify-center flex-col gap-2 w-full">
        <AppCard textFirst="textFirst" textSecond="textSecond" large />
        </div>
      </div>
            <div class="mt-4 mx-auto flex items-center gap-4 max-w-[300px]">
        <div class="flex justify-center flex-col gap-2 w-full">
        <AppCard textFirst="textFirst" textSecond="textSecond" :large="false" />
        </div>
      </div>
    `,
  }),
}
