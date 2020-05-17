<template>
  <v-select
    :value='areanum'
	item-text="label"
	item-value="value"
	:items="areadata"
	label="居住地を変更する"
	class="selectArea"
	@change="$emit('input', $event)"
  >
  </v-select>
</template>

<style lang="scss">

.selectArea {
	padding-top:25px !important;
	font-size: 14px;
	width: 180px;
}

@include lessThan($medium) {
  .selectArea {
	font-size: 12px !important;
	width: 140px;
  }
}
</style>

<script>
export default {
  name: 'AreaSelector',
  props: {
    areanum: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      areadata: [
	    {label:'すべて',value:0},
	    {label:'福岡市',value:1},
	    {label:'北九州市',value:2},
	    {label:'福岡県（その他）',value:3},
	    {label:'それ以外',value:4}
	  ]
    }
  }
}
</script>
