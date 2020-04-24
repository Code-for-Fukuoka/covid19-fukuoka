<template>
<v-container>
  <v-row>
     <v-select
	  v-model="inputData1"
      :items="areadata"
      label="居住地を変更する"
     ></v-select>
</v-row>
<v-row>
     <v-btn-toggle
	  v-model="inputData2"
      class="DataSelector"
	  mandatory
  	 >
      <v-btn v-ripple="false" value="transition" class="DataSelector-Button">
	   日別
      </v-btn>
      <v-btn v-ripple="false" value="cumulative" class="DataSelector-Button">
       累計
      </v-btn>
    </v-btn-toggle>
 </v-row>
 </v-container>
</template>

<style lang="scss">

.row:first-child {
	padding-top:5px;
	width:100% !important;
}

.DataSelector {
  margin-top: 2px;
  border: 1px solid $gray-4;
  background-color: $white;
  &-Button {
    border: none !important;
    margin: 2px;
    border-radius: 4px !important;
    height: 24px !important;
    font-size: 12px !important;
    color: $gray-1 !important;
    background-color: $white !important;
    &::before {
      background-color: inherit;
    }
  }

  & .v-btn--active {
    background-color: $gray-2 !important;
    color: $white !important;
  }
}
</style>

<script>
export default {
  name: 'DataAreaSelector',
  props: {
    areadata: {
      type: Array,
      required: false,
      default: () => []
    },
    areaNumChild: {
      type: Number,
      required: false,
      default: 0
    },
    dataKindChild: {
      type: String,
      required: false,
      default: ''
    }
  },
  computed: {
    inputData1: {
      get () {
        return this.areadata.indexOf(this.areaNumChild)
      },
      set (value) {
        this.$emit('update:areaNumChild', this.areadata.indexOf(value))
      }
    },
    inputData2: {
      get () {
        return this.dataKindChild
      },
      set (value) {
        this.$emit('update:dataKindChild', value)
      }
    }
  }
}
</script>
