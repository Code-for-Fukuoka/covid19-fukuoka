<template>
  <div :class="$style.container">
    <h4 id="consult" :class="[$style.heading, $style.fzXLarge]">
      {{ $t('新型コロナ受診相談窓口（日本語のみ）') }}
      <div :class="$style.link">
        <a
          href="https://www.pref.fukuoka.lg.jp/contents/covid-19-portal.html#A1-5-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('帰国者・接触者 電話相談センター') }}
          <v-icon size="16">
            mdi-open-in-new
          </v-icon>
        </a>
      </div>
    </h4>
    <p :class="[$style.open, $style.fzMedium]">
      <span>{{ $t('24時間対応') }}</span>
    </p>
  </div>
</template>

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
