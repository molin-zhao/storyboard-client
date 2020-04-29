<template>
  <div class="home-wrapper">
    <storyboardHeader :mobile="mobile"></storyboardHeader>
    <storyboardContent></storyboardContent>
    <storyboardFooter></storyboardFooter>
  </div>
</template>

<script>
import storyboardHeader from "@/components/header";
import storyboardFooter from "@/components/footer";
import storyboardContent from "@/components/content";
export default {
  components: {
    storyboardHeader,
    storyboardFooter,
    storyboardContent
  },
  computed: {
    mobile() {
      return this.$route.params.mobile;
    }
  }
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
