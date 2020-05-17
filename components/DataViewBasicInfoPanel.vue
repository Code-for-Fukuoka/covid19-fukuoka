<template>
  <div class="DataView-DataInfo">
    <span v-show="aText" class="DataView-DataInfo-areaName"> {{ aText }}</span>
	<span class="DataView-DataInfo-summary">
	　<span v-if="kindtype && lText > 0" class="DataView-DataInfo-summary-transition">+</span>
	  <span v-bind:style="{ color: activeColor}">{{ lText }}</span>
      <small class="DataView-DataInfo-summary-unit">{{ unit }}</small>
    </span>
    <br />
    <small class="DataView-DataInfo-date">{{ sText }}</small>
  </div>
</template>

<style lang="scss">

.DataView {
  &-DataInfo {
    margin-top: 20px;
    text-align: right;
    &-summary {
      display: inline-block;
      font-family: Hiragino Sans;
      font-style: normal;
      font-size: 30px;
      line-height: 30px;
      &-transition {
        font-size: 0.5em;
      }
      &-unit {
        font-size: 0.6em;
      }
    }
    &-areaName {
      padding-right: 10px;
      font-size: 12px;
      font-weight: bold;
      color: $gray-3;
    }
    &-areaName::after {
      content: '\A';
      white-space: pre;
    }
    &-date {
      white-space: nowrap;
      display: inline-block;
      font-size: 12px;
      line-height: 12px;
      color: $gray-3;
    }
  }
}
.DataView {
  @include card-container();
  height: 100%;
  &-Header {
    background-color: transparent !important;
    height: auto !important;
  }
  &-TitleContainer {
    padding: 14px 0 8px;
  }
  &-Title {
    @include card-h2();
  }
  &-CardText {
    margin-bottom: 46px;
    margin-top: 20px;
  }
}
.v-toolbar__content {
  height: auto !important;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DataViewBasicInfoPanel extends Vue {
  @Prop() private aText!: string
  @Prop() private lText!: string
  @Prop() private sText!: string
  @Prop() private unit!: string
  @Prop() private dataKind!: string
 
  get kindtype() {
    if(this.dataKind === 'transition') {
	  return true
	}
    return false
  }
 
  get activeColor() {
    if(!this.dataKind || this.dataKind === 'cumulative') {
	  return "#4D4D4D"
	}
    if(Number(this.lText) === 0) {
	  return "#5badd6"
	} else {
	  return "#de5a5a"
	}
  }
   
}
</script>
