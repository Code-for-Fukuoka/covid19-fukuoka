<template>
  <div :class="$style.container">
    <div :class="[$style.heading, $style.multi]">
      <span :class="[$style.item, $style.fzMedium]" v-for="item in getPatientList" :key="item.id">
        <span :class="$style.icon">
          <component :is="item.component" aria-hidden="true" />
        </span>
        {{ item.txt }}
      </span>
    </div>
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
    <div v-if="othersConditon.display === true">
	  <p v-if="othersConditon.custom.display === false" :class="$style.duration">
        <i18n path="{duration}続いている">
          <template v-slot:duration>
            <i18n
              :class="[$style.underline, $style.fzLarge]"
              tag="span"
              path="{day}"
            >
              <template v-slot:day>
                <strong><span :class="$style.fzNumeric">{{othersConditon.day}}</span>日{{othersConditon.inequality}}</strong>
              </template>
            </i18n>
          </template>
        </i18n>
      </p>
	  <p v-else :class="$style.duration">
        <i18n v-if="othersConditon.custom.emphasis.display === false" v-bind:path="othersConditon.custom.txt">
        </i18n>
        <i18n v-else v-bind:path="othersConditon.custom.txt">
          <template v-slot:duration>
            <i18n
              tag="span"
              v-bind:path="othersConditon.custom.emphasis.word"
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
import AccessibleIcon from '@/static/flow/responsive/accessible.svg'
import ArrowForwardIcon from '@/static/flow/responsive/arrow_forward.svg'
import DirectionsWalkIcon from '@/static/flow/responsive/directions_walk.svg'
import PregnantWomanIcon from '@/static/flow/responsive/pregnant_woman.svg'
import OtherSymptomIcon from '@/static/flow/responsive/other_symptom.svg'
import Status from '@/components/flow/status.json'

export default {
  components: {
    AccessibleIcon,
    ArrowForwardIcon,
    DirectionsWalkIcon,
    PregnantWomanIcon,
	OtherSymptomIcon
  },
  data() {
    return {
	  status: Status,
	  othersConditon:{
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
    if(this.status.others.display) {
	  this.othersConditon.display = true
	  this.othersConditon.day = this.status.others.day
	  this.othersConditon.inequality = this.status.others.inequality
	  if(this.status.others.custom.display) {
	    this.othersConditon.custom.display = true
	    this.othersConditon.custom.txt = this.status.others.custom.txt
		if(this.status.others.custom.emphasis.display) {
		  this.othersConditon.custom.emphasis.display = true
		  this.othersConditon.custom.emphasis.word = this.status.others.custom.emphasis.word
		  let txt = this.othersConditon.custom.txt
		  let word = this.othersConditon.custom.emphasis.word
		  let customTxt = txt.replace(new RegExp(word, 'g'), '{duration}')
		  this.othersConditon.custom.txt = customTxt
		}
	  } 
	} 
  },
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
	},
	getPatientList() {
	  let patientList = []
	  this.status.others.list.forEach(d => {
	    let obj = {
	      'component': "",
		  'txt': ""
	    }
	  
	    switch (true) {
          case d.includes('ご高齢な方'):
		    obj.component = "DirectionsWalkIcon"
		    obj.txt = d
            break
          case d.includes('基礎疾患のある方'):
		    obj.component = "AccessibleIcon"
		    obj.txt = d
            break
          case d.includes('妊娠中の方'):
		    obj.component = "PregnantWomanIcon"
		    obj.txt = d
            break
          default:
		    obj.component = "OtherSymptomIcon"
		    obj.txt = d
            break	  
        }
	    patientList.push(obj)
	  })
	  return patientList
	}
  },
  methods: { onDoneScroll }
}
</script>

<style module lang="scss">
@import '@/components/flow/flow_sp.scss';

.heading {
  // elder
  &.multi {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: px2vw(-20);
    margin-left: px2vw(-10);
    margin-right: px2vw(-10);

    .icon {
      display: block;
      margin-bottom: 0;
      width: px2vw(50);
      height: px2vw(50);
    }

    > .item {
      display: flex;
      align-items: center;
      margin: px2vw(20) px2vw(10) 0;

      svg {
        margin-right: px2vw(5);
      }
    }
  }
}

@include largerThan($small) {
  $vw: 960;

  .heading {
    &.multi {
      margin-top: px2vw(-20, $vw);
      margin-left: px2vw(-10, $vw);
      margin-right: px2vw(-10, $vw);

      .icon {
        width: px2vw(50, $vw);
        height: px2vw(50, $vw);
      }

      > .item {
        margin: px2vw(20, $vw) px2vw(10, $vw) 0;

        svg {
          margin-right: px2vw(5, $vw);
        }
      }
    }
  }
}

.Summary {
    margin-top: 5vw;
	text-align: center;
	font-weight: normal;
}

</style>
