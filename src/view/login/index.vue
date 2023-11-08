<template>
  <div class="login">
    <Form
      ref="FormLine"
      :model="FormData"
      :rules="ruleInline"
      style="width: 300px"
    >
      <FormItem prop="userName">
        <Input type="text" v-model="FormData.userName" placeholder="Username">
          <template #prepend>
            <Icon type="ios-person-outline"></Icon>
          </template>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input
          type="password"
          v-model="FormData.password"
          placeholder="Password"
        >
          <template #prepend>
            <Icon type="ios-lock-outline"></Icon>
          </template>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('FormLine')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import * as login from "../../api/login";
  const { user_login } = login;
  import { computed, reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import { number } from "echarts";
  const router = useRouter();
  let FormLine = ref<any>(null);
  let FormData = reactive({
    userName: "",
    password: "",
  });

  let ruleInline = computed(() => {
    return {
      userName: [
        {
          required: true,
          message: "Please fill in the user name",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "Please fill in the password.",
          trigger: "blur",
        },
      ],
    };
  });
  interface LoginData {
    userName: string;
    password: string;
  }
  const userLogin = (data: LoginData) => {
    user_login(data).then((res) => {
      router.push("/");
    });
  };

  const handleSubmit = (name: string): void => {
    if (name == "FormLine") {
      FormLine.value.validate((valid: boolean) => {
        if (valid) {
          userLogin(FormData);
        } else {
          //手动调用每个item校验方法
          for (let el of FormLine.value.fields) {
            el.formBlur();
          }
        }
      });
    }
  };
</script>

<style scoped>
  .login {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>