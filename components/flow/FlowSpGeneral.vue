<template>
  <div :class="$style.container">
    <p :class="$style.heading">
      <span :class="[$style.icon, $style.top]" aria-hidden="true">
        <HumanIcon />
      </span>
      <span :class="$style.fzMedium">{{ $t('一般の方') }}</span>
    </p>
    <ul :class="[$style.rectContainer, $style.double]">
      <li :class="$style.symptom" v-for="item in getSymptomList" :key="item.id">
        <span v-if = "item.emphasis === true">
          <i18n v-bind:path="item.txt">
            <template v-slot:emphasis>
              <span :class="$style.ConditionsItemLarger">
                 {{ item.emphasisWord }}
              </span>
            </template>
          </i18n>
        </span>
		<span v-else>{{ item.txt }}</span>
      </li>
    </ul>
	<p :class="$style.Summary">等の強い症状のいずれかがある場合</p>
    <div v-if="normalConditon.display === true">
	  <p v-if="normalConditon.custom.display === false" :class="$style.duration">
        <i18n path="{duration}続いている">
          <template v-slot:duration>
            <i18n
              :class="[$style.underline, $style.fzLarge]"
              tag="span"
              path="{day}"
            >
              <template v-slot:day>
                <strong><span :class="$style.fzNumeric">{{normalConditon.day}}</span>日{{normalConditon.inequality}}</strong>
              </template>
            </i18n>
          </template>
        </i18n>
      </p>
	  <p v-else :class="$style.duration">
        <i18n v-if="normalConditon.custom.emphasis.display === false" v-bind:path="normalConditon.custom.txt">
        </i18n>
        <i18n v-else v-bind:path="normalConditon.custom.txt">
          <template v-slot:duration>
            <i18n
              tag="span"
              v-bind:path="normalConditon.custom.emphasis.word"
              :class="[$style.underline, $style.fzLarge]"
            >
            </i18n>
          </template>
        </i18n>	  
	  </p>
	</div>
    <a
      v-scroll-to="{
        el: '#consult',
        onDone: onDoneScroll
      }"
      href="#consult"
      :class="[$style.button, $style.clickable]"
    >
      <span :class="$style.text">{{ $t('新型コロナ受診相談窓口へ') }}</span>
      <ArrowForwardIcon :class="$style.icon" />
    </a>
  </div>
</template>

<script>
import { onDoneScroll } from '@/utils/vueScrollTo'
import HumanIcon from '@/static/flow/responsive/accessibility.svg'
import ArrowForwardIcon from '@/static/flow/responsive/arrow_forward.svg'
import Status from '@/components/flow/status.json'


export default {
  components: { HumanIcon, ArrowForwardIcon },
  data() {
    return {
	  status: Status,
	  normalConditon : {
	    display:false,
	    day:0,
		inequality:"",
		custom: {
		  display:false,
		  txt: "",
		  emphasis: {
		    display:false,
			word:""
		  }
		}
	  }
    }
  },
  created() {
    if(this.status.normal.display) {
	  this.normalConditon.display = true
	  this.normalConditon.day = this.status.normal.day
	  this.normalConditon.inequality = this.status.normal.inequality
	  if(this.status.normal.custom.display) {
	    this.normalConditon.custom.display = true
	    this.normalConditon.custom.txt = this.status.normal.custom.txt
		if(this.status.normal.custom.emphasis.display) {
		  this.normalConditon.custom.emphasis.display = true
		  this.normalConditon.custom.emphasis.word = this.status.normal.custom.emphasis.word
		  let txt = this.normalConditon.custom.txt
		  let word = this.normalConditon.custom.emphasis.word
		  let customTxt = txt.replace(new RegExp(word, 'g'), '{duration}')
		  this.normalConditon.custom.txt = customTxt
		}
	  } 
	}  
  },
  methods: { onDoneScroll},
  computed: {
    getSymptomList() {
	  let symptomList = []
	  this.status.symptomList.forEach(d => {
	    let obj = {
	      'txt': "",
	      'emphasis': false,
		  'emphasisWord': "",
	    }
		
		if(d.emphasis.length > 0) {
		  obj.emphasis = true
		  obj.emphasisWord = d.emphasis		  
		  let txt  = d.txt.replace(new RegExp(d.emphasis, 'g'), '{emphasis}')
		  obj.txt = txt
		} else {
		  obj.txt = d.txt
		}
	    symptomList.push(obj)
	  })
	  return symptomList
    }
  }
}
</script>

<style module lang="scss">
@import '@/components/flow/flow_sp.scss';
.Summary {
    margin-top: 5vw;
	text-align:center;
	font-weight: normal;
}

</style>
