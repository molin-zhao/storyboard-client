<template>
  <div class="footer">
    <span class="display-only">© {{ copyRight }} {{ $t("COKEWISE") }}</span>
    <div class="beian">
      <img src="/static/beian.png" />
      <a
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51010702001906"
        >{{ beianSecurityCode }}</a
      >
      <a rel="nofollow" href="http://beian.miit.gov.cn">{{ beianCode }}</a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    copyRight: () => {
      let date = new Date();
      let currentYear = date.getFullYear();
      if (currentYear > 2019) return `2019-${currentYear}`;
      else return `2019`;
    },
    beianCode() {
      return "蜀ICP备20015350号";
    },
    beianSecurityCode() {
      return "川公网安备 51010702001906号";
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
  span {
    display: inline-block;
    vertical-align: middle;
    font-weight: bold;
    font-size: 12px;
    line-height: normal;
  }
  .beian {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
    }
    a {
      font-size: 12px;
      margin-left: 5px;
      margin-right: 5px;
    }
    a:hover {
      text-decoration: none;
    }
  }
}
</style>
