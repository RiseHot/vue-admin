<template>
	<svg :class="svgClass" aria-hidden = "true">
		<use :xlink:href="name"></use>
	</svg>
</template>

<script>
	import {reactive,ref,onMounted} from '@vue/composition-api';
	export default {
		name: "svgIcon",
		setup(){
			const msg = ref("sdlkjff");
			
			return {
				msg
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
