<template>
  <div class="SideNavigation">
    <div class="SideNavigation-HeadingContainer sp-flex">
      <v-icon
        class="SideNavigation-HeadingIcon pc-none"
        :aria-label="$t('Navi Open')"
        @click="openNavi"
      >
        mdi-menu
      </v-icon>
      <nuxt-link to="/" class="SideNavigation-HeadingLink">
        <div class="SideNavigation-Logo">
          <img src="/logo.png" :alt="$t('Fukuoka')" />
        </div>
        <h1 class="SideNavigation-Heading">
          {{ $t('City') }} {{ $t('COVID-19') }}<br />{{ $t('Measures site') }}
        </h1>
      </nuxt-link>
    </div>
    <v-divider class="SideNavigation-HeadingDivider" />
    <div class="sp-none" :class="{ open: isNaviOpen }">
      <v-icon
        class="SideNavigation-ListContainerIcon pc-none"
        :aria-label="$t('Navi Close')"
        @click="closeNavi"
      >
        mdi-close
      </v-icon>
      <v-list :flat="true">
        <v-container
          v-for="(item, i) in items"
          :key="i"
          class="SideNavigation-ListItemContainer"
          @click="closeNavi"
        >
          <ListItem :link="item.link" :icon="item.icon" :title="item.title" />
          <v-divider v-show="item.divider" class="SideNavigation-Divider" />
        </v-container>
      </v-list>
      <v-footer class="SideNavigation-Footer">
        <div class="SideNavigation-Footer">
          <div class="SideNavigation-OrgLinkContainer150">
            運営： 
            <a
              href="https://www.codeforfukuoka.org/"
              target="_blank"
              rel="noopener"
            >
              <img src="/logo-code4Fukuoka.png" alt="Code for Fukuoka" />
            </a>
          </div>
        </div>
        <div class="SideNavigation-Footer">
          <div class="SideNavigation-OrgLinkContainer150">
            運営： 
            <a
              href="http://code4kurume.org/"
              target="_blank"
              rel="noopener"
            >
              <img src="/logo-code4kurume.png" alt="Code for Kurume" />
            </a>
          </div>
        </div>
        <div class="SideNavigation-Footer">
          <div class="SideNavigation-OrgLinkContainer150">
            協力：
            <a
              href="https://www.pref.fukuoka.lg.jp/"
              target="_blank"
              rel="noopener"
            >
              <img src="/logo-fukuoka.png" alt="福岡県" />
            </a>
          </div>
        </div>
        <small class="SideNavigation-Copyright">
          {{ $t('このサイトの内容物は') }}
          <a
            rel="license"
            target="_blank"
            :href="$t('https://creativecommons.org/licenses/by/4.0/deed.ja')"
          >
            {{ $t('クリエイティブ・コモンズ 表示 4.0 ライセンス') }}
          </a>
          {{ $t('の下に提供されています。') }}
          <br />
          2020 Code for Fukuoka
        </small>
      </v-footer>
    </div>
  </div>
</template>

<i18n>
{
  "ja": {
    "Navi Open": "サイドメニュー項目を開く",
    "Navi Close": "サイドメニュー項目を閉じる",
    "Fukuoka": "福岡県",
    "City": "福岡県",
    "COVID-19": "新型コロナウイルス感染症",
    "Measures site": "ポータルサイト",
    "The latest updates": "福岡県内の感染動向",
    "If you have any symptoms": "感染が疑われる場合の受診・相談について",
    "Portal": "新型コロナウイルス感染症ポータルページ",
    "for Citizens": "県民の方、事業者の方への支援情報",
    "Cancelled public events": "県主催のイベント・行事の中止・延期",
    "for school": "県内の学校等での対応",
    "Government official website": "福岡県公式ホームページ",
    "Message from Governor": "知事からのメッセージ",
    "About us": "当サイトについて"
  }
}
</i18n>

<script>
import ListItem from '@/components/ListItem'

export default {
  components: {
    ListItem
  },
  props: {
    isNaviOpen: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    items() {
      return [
        {
          icon: 'mdi-chart-timeline-variant',
          title: this.$t('The latest updates'),
          link: '/'
        },
        {
          icon: 'covid',
          title: this.$t('If you have any symptoms'),
          link: 'https://www.pref.fukuoka.lg.jp/contents/covid-19-portal.html#a1-5',
          divider: true
        },
        {
          icon: 'mdi-earth',
          title: this.$t('Portal'),
          link: 'https://www.pref.fukuoka.lg.jp/contents/covid-19-portal.html'
        },
        {
          icon: 'mdi-domain',
          title: this.$t('for Citizens'),
          link: 'https://www.pref.fukuoka.lg.jp/contents/covid-19-support-allsoudan.html',
          divider: true
        },
        {
          title: this.$t('Cancelled public events'),
          link:
            'https://www.pref.fukuoka.lg.jp/contents/rinjikyuukan.html#sp_headline_2'
        },
        {
          title: this.$t('for school'),
          link: 'https://www.pref.fukuoka.lg.jp/contents/kyouikutaiou.html',
          divider: true
        },
        {
          title: this.$t('About us'),
          link: '/about'
        },
        {
          title: this.$t('Government official website'),
          link: 'https://www.pref.fukuoka.lg.jp/',
          divider: true
        }
      ]
    },
    isClass() {
      return item => (item.title.charAt(0) === '【' ? 'kerningLeft' : '')
    }
  },
  methods: {
    openNavi() {
      this.$emit('openNavi')
    },
    closeNavi() {
      this.$emit('closeNavi')
    }
  }
}
</script>

<style lang="scss" scoped>
.SideNavigation {
  position: relative;
  height: 100%;
  background: $white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
  &-HeadingContainer {
    padding: 1.25em 0 1.25em 1.25em;
    align-items: center;
    @include lessThan($small) {
      padding: 7px 0 7px 20px;
    }
  }
  &-HeadingIcon {
    margin-right: 16px;
  }
  &-HeadingLink {
    @include lessThan($small) {
      display: flex;
      align-items: center;
    }
    text-decoration: none;
  }
  &-ListContainerIcon {
    margin: 24px 16px 0;
  }
  &-ListItemContainer {
    padding: 2px 20px;
  }
  &-Logo {
    margin: 20px 16px 0 0;
    width: 150px;
    @include lessThan($small) {
      margin-top: 0;
      width: 50px;
    }
  }
  &-Heading {
    margin-top: 8px;
    font-size: 13px;
    color: #898989;
    padding: 0.5em 0;
    text-decoration: none;
    @include lessThan($small) {
      margin-top: 0;
    }
  }
  &-HeadingDivider {
    margin: 0px 20px 4px;
    @include lessThan($small) {
      display: none;
    }
  }
  &-Divider {
    margin: 12px 0;
  }
  &-Footer {
    padding: 20px;
    background-color: $white;
  }
  &-SocialLinkContainer {
    display: flex;
    align-items: center;
    & img {
      width: 30px;
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
  &-OrgLinkContainer150 {
    display: flex;
    vertical-align: middle;
    & img {
      width: 150px;
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
  &-Copyright {
    display: block;
    margin-top: 10px;
    font-size: 8px;
    line-height: 1.2;
    color: $gray-1;
    font-weight: bold;
    & a {
      font-size: 8px;
    }
  }
}
.open {
  @include lessThan($small) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    display: block !important;
    width: 100%;
    z-index: z-index-of(opened-side-navigation);
    background-color: $white;
  }
}
@include largerThan($small) {
  .pc-none {
    display: none;
  }
}
@include lessThan($small) {
  .sp-flex {
    display: flex;
  }
  .sp-none {
    display: none;
  }
}
</style>
