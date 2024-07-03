<!-- src/.vitepress/components/DataWidget.vue -->  
<template>  
  <div v-html="widgetCode"></div>  
</template>  
 
<script>  
export default {  
  data() {  
    return {  
      widgetCode: `<script id="LA-DATA-WIDGET" crossorigin="anonymous" charset="UTF-8" src="https://v6-widget.51.la/v6/你的挂件ID/quote.js?theme=..."></script>`  
    };  
  },  
  mounted() {  
    // 注意：通常不建议在Vue组件中直接插入script标签，因为这可能会导致安全问题或不被执行。  
    // 但对于51.la的挂件，可能因为它是一个第三方库，直接通过v-html插入可能有效。  
    // 如果不行，可能需要考虑其他方法，如通过iframe或服务器端渲染。  
  }  
}  
</script>