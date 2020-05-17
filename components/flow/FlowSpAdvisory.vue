<template>
  <div :class="$style.container">
    <h4 id="consult" :class="[$style.heading, $style.fzXLarge]">
      {{ $t('新型コロナ受診相談窓口（日本語のみ）') }}
      <small :class="[$style.break, $style.fzRegular, $style.mt5]">{{
        $t('帰国者・接触者相談センター（保健所）')
      }}</small>
    </h4>
    <p :class="[$style.open, $style.fzMedium]">
      <span>{{ $t('24時間対応') }}</span>
    </p>
    <div :class="$style.link">
      <a
        v-bind:href="getUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ $t('各保健所の電話番号は新型コロナウイルス感染症ポータルページへ') }}
        <v-icon size="16">
          mdi-open-in-new
        </v-icon>
      </a>
    </div>
  </div>
</template>

<script>
import Status from '@/components/flow/status.json'
export default {
  data() {
    return {
	  status: Status
    }
  },
  computed: {
    getUrl() {
	  let URL = this.status.infoURL
	  if(URL.length == 0) {
	   URL = "https://www.pref.fukuoka.lg.jp/contents/covid-19-portal.html"
	  } 
      return URL
    }
  }
}
</script>

<style module lang="scss">
@import '@/components/flow/flow_sp.scss';

// advisory
.open {
  margin-top: px2vw(20);
  display: flex;
  justify-content: center;

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $white;
    color: $blue-1;
    padding: px2vw(20) px2vw(40);
    border-radius: px2vw(6);
  }
}

.link {
  margin-top: px2vw(30);
  margin-bottom: px2vw(20);
  display: flex;
  justify-content: center;
  flex-basis: 60%;
  > a {
    text-decoration: none;
  }
}

@include largerThan($small) {
  $vw: 960;

  .open {
    margin-top: px2vw(20, $vw);

    > span {
      padding: px2vw(20) px2vw(40, $vw);
      border-radius: px2vw(6, $vw);
    }
  }
}
</style>
