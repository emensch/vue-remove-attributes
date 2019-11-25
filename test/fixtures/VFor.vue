<template>
  <div>
    <div data-testid="item" v-for="n in 3" :key="n" :foo-bar="n" foo-baz foo-qux> foobar </div>
  </div>
</template>