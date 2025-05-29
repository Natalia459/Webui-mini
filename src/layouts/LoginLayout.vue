<template>
  <main>
    <div class=login-main>
      <div class="login-container">
        <div>
          <div class="login-brand mb-5">
            <LogoIBM />
          </div>
          <form class=login-form @submit.prevent="login">
            <Field 
            name="username" 
            v-model="userInfo.username" 
            :rules="requiredRule" 
            v-on:input="userInfo.username.toString()"
            />
            <ErrorMessage name="username" />
            
          </form>

          <form class="login-form">
            <Field 
            name="password" 
            v-model="userInfo.password" 
            type="password" 
            :rules="requiredRule"
            v-on:input="userInfo.password.toString()"
            />
            <ErrorMessage name="password" />
          </form>
            
          <button 
          type="submit" 
          v-on:click="login(userInfo)" 
          v-bind:disabled="disableSubmitButton">
            Login
          </button>
          
          <p v-if="authError" class="error-message">
            Login or password is not correct
          </p>
        </div>
      </div>
      <div class="login-aside">
        <div class="login-aside__logo-brand">
          <LogoBuildOnOpenBMC />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { Field, ErrorMessage, useForm } from 'vee-validate';
  import LogoIBM from './images/logo-ibm.svg';
  import LogoBuildOnOpenBMC from './images/built-on-openbmc-logo.svg';

  defineOptions({
      name: 'LoginLayout'
  })

  const store = useStore();
  const router = useRouter();

  const disableSubmitButton = ref(false);
  const userInfo = ref({
    username: '',
    password: ''
  });

  const requiredRule = (value) => {
    return value ? true : 'This field is required';
  };

  const { handleSubmit, setFieldError } = useForm({
    validationSchema: {
      username: (value) => requiredRule(value),
      
      password: (value) => requiredRule(value)
    }  
  });  

  const login = handleSubmit((values) => {
    disableSubmitButton.value = true;

    store.dispatch('authentication/login', values)
      .then(() => {
        localStorage.setItem('storedUsername', values.username);
        store.commit('global/setUsername', values.username);
        router.push('/');
      })
      .catch((error) => {
        setFieldError('form', error.message);
        alert("Login or password is wrong!");
        console.error(error);
      })
      .finally(() => {
        disableSubmitButton.value = false;
      });
  });

  const authError = computed(() => {
    store.getters['authentication/authError'];
  });
  document.title = 'Login';
</script>

<style scoped>
.login-container {
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex-grow: 1;
  min-width: 320px;
  min-height: 95vh;
  justify-content: space-around;
}

.login-brand {
  display: block;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  max-width: 15vw;
  max-height: 15vh;
}

.login-main {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  min-height: 50vh;
  padding: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  min-height: 5vh;
  margin: 0 auto;
}

.login-aside {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  margin: 8px;
}

.login-aside__logo-brand {
  display: block;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  margin-bottom: 500px;
  max-width: 15vw;
  max-height: 15vh;
}

@media (min-width: 768px) {
  .login-main {
    flex-wrap: nowrap;
  }
  
  .login-container {
    flex: 1;
    max-width: 400px;
  }
  
  .login-aside {
    flex: 1;
    max-width: 900px;
  }
  
  .login-brand img {
    max-height: 200px;
  }
}
</style>