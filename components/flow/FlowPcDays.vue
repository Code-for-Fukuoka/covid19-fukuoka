<template>
  <div :class="$style.Flow">
    <div :class="$style.FlowRow">
      <div :class="$style.FlowRowRowThree">
        <p :class="$style.FlowRowRowThreeGeneral">
          <img
            :class="$style.FlowRowRowThreeGeneralIcon"
            src="/flow/accessibility-24px.svg"
            aria-hidden="true"
            alt=" "
          />
          {{ $t('一般の方') }}
        </p>
      </div>
      <div v-if="normalConditon.display === true">
        <p v-if="normalConditon.custom.display === false">
          <i18n path="{duration}続いている">
            <template v-slot:duration>
              <i18n
                tag="span"
                path="{day}日{inequality}"
                :class="$style.FlowRowEmphasis"
              >
                <template v-slot:day>
                  <span :class="$style.FlowRowEmphasisDay">{{normalConditon.day}}</span>
                </template>
               <template v-slot:inequality>
                  <span>{{normalConditon.inequality}}</span>
                </template>
              </i18n>
            </template>
          </i18n>
        </p>
		<p v-else>
          <i18n v-if="normalConditon.custom.emphasis.display === false" v-bind:path="normalConditon.custom.txt">
          </i18n>
          <i18n v-else v-bind:path="normalConditon.custom.txt">
            <template v-slot:duration>
              <i18n
                tag="span"
                v-bind:path="normalConditon.custom.emphasis.word"
                :class="$style.FlowRowEmphasis"
              >
              </i18n>
            </template>
          </i18n>
		</p>
      </div>
    </div>
    <div :class="[$style.FlowRow, $style.FlowRowRowCheck]">
      <div :class="$style.FlowRowCondition" v-for="item in getSymptomList" :key="item.id">
        <p v-if = "item.emphasis === true">
          <i18n
            tag="span"
			v-bind:path="item.txt"
            :class="$style.FlowRowConditionSmall"
          >
            <template v-slot:emphasis>
              <span :class="$style.FlowRowConditionLarge">
                {{ item.emphasisWord }}
              </span>
            </template>
          </i18n>
        </p>
		<p v-else>{{item.txt}} </p>
        <img
          :class="$style.FlowRowConditionIcon"
          src="/flow/check_circle-24px.svg"
          aria-hidden="true"
          alt=" "
        />
      </div>
      <div :class="[$style.FlowRowCondition, $style.FlowRowSummary]">
	    <p>等の強い症状のいずれかがある場合</p>
      </div>
    </div>
    <div :class="$style.FlowRow">
      <div :class="$style.FlowRowRowThree">
        <ul :class="$style.FlowRowRowThreeCareTargetList">
          <li :class="$style.FlowRowRowThreeCareTargetListItem" v-for="item in getPatientList" :key="item.id">
            <img
              :class="$style.FlowRowRowThreeCareTargetListItemIcon"
              :src="item.src"
              aria-hidden="true"
              alt=" "
            />
			<span>{{ item.txt }}</span>
          </li>
        </ul>
      </div>
      <div v-if="othersConditon.display === true">
        <p v-if="othersConditon.custom.display === false">
          <i18n path="{duration}続いている">
            <template v-slot:duration>
              <i18n
                tag="span"
                path="{day}日{inequality}"
                :class="$style.FlowRowEmphasis"
              >
                <template v-slot:day>
                  <span :class="$style.FlowRowEmphasisDay">{{othersConditon.day}}</span>
                </template>
               <template v-slot:inequality>
                  <span>{{othersConditon.inequality}}</span>
                </template>
              </i18n>
            </template>
          </i18n>
        </p>
		<p v-else>
          <i18n v-if="othersConditon.custom.emphasis.display === false" v-bind:path="othersConditon.custom.txt">
          </i18n>
          <i18n v-else v-bind:path="othersConditon.custom.txt">
            <template v-slot:duration>
              <i18n
                tag="span"
                v-bind:path="othersConditon.custom.emphasis.word"
                :class="$style.FlowRowEmphasis"
              >
              </i18n>
            </template>
          </i18n>
		</p>
      </div>
    </div>
  </div>
</template>

<script>
import Status from '@/components/flow/status.json'
export default {
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
	  },
	  othersConditon : {
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
  created () {
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
	      'src': "",
		  'txt': ""
	    }
	  
	    switch (true) {
          case d.includes('ご高齢な方'):
		    obj.src = "/flow/directions_walk-24px.svg"
		    obj.txt = d
            break
          case d.includes('基礎疾患のある方'):
		    obj.src = "/flow/accessible-24px.svg"
		    obj.txt = d
            break
          case d.includes('妊娠中の方'):
		    obj.src = "/flow/pregnant_woman-24px.svg"
		    obj.txt = d
            break
          default:
		    obj.src = "/flow/other_symptom-24px.svg"
		    obj.txt = d
            break		  
        }
	    patientList.push(obj)
	  })
	  return patientList
	}
  }
}
</script>

<style module lang="scss">

.Flow {
  @include card-container($withDivider: true);

  display: flex;
  flex-direction: row;
  padding: 20px 20px !important;
  position: relative;
  color: $gray-2;

  &Row {
    flex-grow: 1;
    flex-shrink: 0;
    flex-basis: 36%;
    display: flex;
    flex-direction: column;
    text-align: center;

    &RowCheck {
      flex-basis: calc(28% - 20px);
      margin: 0 10px;
    }

    &RowThree {
      flex-grow: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;

      &General {
        &Icon {
          display: block;
          margin: auto;
          width: 44px;
          height: 44px;
        }
      }

      &CareTargetList {
        margin: 16px 0;
        text-align: left;
        list-style: none;

        &Item {
          display: flex;
          align-items: center;

          &Icon {
            display: inline-block;
            width: 30px;
            height: 30px;
          }
		  
        }
        &Item + &Item {
          margin-top: 14px;
        }
      }
    }

    &Condition {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      padding: 10px;
      position: relative;
      border: 2px solid $blue-1 !important;
      border-radius: 2px;
      background-color: $white;

      p {
        text-align: center;
        display: inline-block;
        margin: 0 !important; // FIXME: IEだとv-applicationのmarginが優先される
        font-size: calc(0.875rem + ((1vw - 7.68px) * 0.8929));
        font-weight: bold;

        @include largerThan($large) {
          font-size: 20px;
        }
      }

      &Large {
        font-size: calc(1rem + ((1vw - 7.68px) * 2.4876));

        @include largerThan($large) {
          font-size: 25px;
        }
      }

      &Small {
        font-size: 15px;
      }

      &Icon {
        position: absolute;
        left: -8px;
        top: -8px;
        width: 24px;
        height: 24px;
      }

      &::before {
        position: absolute;
        left: -4px;
        top: -4px;
        width: 20px;
        height: 20px;
        background-color: white;
        content: '';
      }      
    }
	
    &Summary {
	  border: 0px !important;
	  p {
	    font-weight:normal;
		font-size: calc(0.575rem + ((1vw - 7.68px) * 0.8929));
	  }
	  
      &::before {
	    display:none;
      }   
	
	}

    &Emphasis {
      font-size: 24px;
      font-weight: bold;
      border-bottom: solid 3px $blue-1;

      &Day {
        font-size: 41px;
      }
    }
  }
}
</style>
