<script setup>
import { computed } from "vue";
import { useListingI18n } from "../../../composables/useListingI18n";
const props = defineProps({
  options: { type: Array, required: true },
  sort: { type: null, required: true },
  label: { type: String, required: false }
});
const emit = defineEmits(["change"]);
const { t } = useListingI18n();
function optionKey(opt) {
  return `${opt.field}:${opt.direction}`;
}
function parseKey(key) {
  const [field, dir] = key.split(":");
  if (field && (dir === "ASC" || dir === "DESC")) {
    return { field, direction: dir };
  }
  return null;
}
const selectedKey = computed({
  get() {
    if (!props.sort || props.sort.length === 0) return "";
    const first = props.sort[0];
    return `${first.field}:${first.direction}`;
  },
  set(key) {
    if (!key) {
      emit("change", []);
      return;
    }
    const parsed = parseKey(key);
    if (parsed) {
      emit("change", [parsed]);
    }
  }
});
const selectOptions = computed(() => {
  return props.options.map((opt) => ({
    label: opt.label,
    value: optionKey(opt),
    onSelect: () => emit("change", [opt])
  }));
});
const buttonLabel = computed(() => {
  const key = selectedKey.value;
  const selected = props.options.find((opt) => optionKey(opt) === key);
  const selectedText = selected?.label ?? "";
  return t("listing.sortBy", { label: selectedText });
});
</script>

<template>
	<UDropdownMenu :items="selectOptions">
		<UButton
			size="lg"
			color="primary"
			class="rounded-full"
			variant="outline"
			:aria-label="buttonLabel"
		>
			<!-- Text: hidden on mobile, visible from sm+ -->
			<span class="hidden sm:inline">
        {{ buttonLabel }}
      </span>

			<!-- Icon: always visible -->
			<UIcon
				name="i-lucide-arrow-down-wide-narrow"
				class="h-4 w-4"
				:class="{ 'sm:ms-2': true }"
			/>
		</UButton>
	</UDropdownMenu>
</template>
