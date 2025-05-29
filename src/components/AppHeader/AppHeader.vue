<template>
  <div>
    <header id="page-header">
      <nav class="navbar">
        <div class="login-brand mb-5">
          <LogoHeader />
        </div>
        
        <ul class="nav-links">
          <li>
            <RouterLink
              to="/operations/reboot-bmc"
              >Reboot BMC
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/security-and-access/sessions"
              >Sessions
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/security-and-access/policies"
              >Policies
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/settings/network"
              >Network
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/settings/date-time"
              >Date and time
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/login"
              @click="logout"
              >Logout
            </RouterLink>
          </li>
        </ul>
            
        <button class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  import LogoHeader from './images/logo-header.svg';
  import $bus from '../../eventBus'

  defineOptions({
    name: 'AppHeader'
  })

  const route = useRoute();
  const router = useRouter();
  const store = useStore();

  const props = defineProps({
    routerKey: {
      type: Number,
      default: 0,
    }
  });

  const isNavigationOpen = ref(false);
  const currentUserRole = ref(null);

  const isAuthorized = computed(() => store.getters['global/isAuthorized']);

  watch(route, () => {
    isNavigationOpen.value = false;
  });

  watch(isAuthorized, (value) => {
    if (value === false) {
      errorToast(('global.toast.unAuthDescription'), {
        title: ('global.toast.unAuthTitle'),
      });
    }
  });

  watch(isNavigationOpen, (value) => {
    emit('change-is-navigation-open', value);
  });

  onMounted(() => {
    getPrivilege();
    $bus.on('toggle-navigation', toggleIsOpen);
  });

  // Methods
  const logout = () => {
    store.dispatch('authentication/logout');
  };

  const toggleIsOpen = () => {
    isNavigationOpen.value = !isNavigationOpen.value;
  };

  const getPrivilege = () => {
    currentUserRole.value = store?.getters['global/userPrivilege'];
  };

  const emit = defineEmits(['change-is-navigation-open']);

  defineExpose({
    LogoHeader
  });
</script>

<style scoped>
.login-brand {
  display: block;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  max-width: 15vw;
  max-height: 15vh;
}
</style>