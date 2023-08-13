<template>
  <Editor
    id="tinymce"
    v-model="content"
    :init="init"
    model-events="change keydown blur focus paste"
  ></Editor>
</template>

<script>
import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/icons/default/icons";
import "tinymce/themes/silver";
import "tinymce/plugins/media";
import "tinymce/plugins/contextmenu";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/preview";
import "tinymce/plugins/advlist";
import "tinymce/plugins/codesample";
import "tinymce/plugins/hr";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/directionality";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/template";
import "tinymce/plugins/charmap";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/autosave";
import "tinymce/plugins/save";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/paste";
import "tinymce/plugins/print";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/bbcode";
import "tinymce/plugins/tabfocus";
// 扩展插件
// import "../assets/tinymce/plugins/lineheight/plugin";
// import "../assets/tinymce/plugins/bdmap/plugin";

import { uploadFile, deleteFile } from "@/api/fileUpload";
export default {
  name: "TinyEditor",
  components: { Editor },
  props: {
    value: {
      type: String,
      default: "",
    },
    resetValue: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let self = this  // 加上这一句就OK了
    return {
      content: "",
      //fileList: [],
      allImageList: [],
      baseHost: window.location.host,
      baseApi: process.env.VUE_APP_BASE_API,
      init: {
        language_url: "/tinymce/langs/zh_CN.js", // 语言包位置，因为放在public下所以可以省略public
        selector: "#tinymce", //tinymce的id
        // auto_focus: 'element1',
        language: "zh_CN", //语言类型
        skin_url: "/tinymce/skins/ui/oxide",
        height: 900, //编辑器高度
        min_height: 410,
        // min_width: 700,
        highlight_on_focus: true,
        // contextmenu_never_use_native: true,//5.0.1
        draggable_modal: true,
        //inline: true,
        // content_style: "p {margin: 2px 0;}",
        init_instance_callback: (editor) => {
          // 更改元素为Div
          editor.execCommand("mceInsertContent", false, "<p></p>");
        },
        browser_spellcheck: true, // 拼写检查
        // elementpath: false, //禁用编辑器底部的状态栏
        // statusbar: false, // 隐藏编辑器底部的状态栏
        // menubar: false, //最顶部文字信息
        // mobile: {
        //   menubar: true,
        //   plugins: ["autosave", "lists", "autolink"],
        //   toolbar: ["undo", "bold", "italic", "styleselect"],
        // },
        // mode: "textareas",
        placeholder: "在此处书写...",
        // forced_root_block: '', // 删除在tinymce中自动添加的p标签
        // force_br_newlines : true,
        // force_p_newlines : false,
        preview_styles: "font-size color",
        invalid_styles: {
          "*": "color font-size", //全局无效样式
          a: "background", // 链接禁用背景样式
        },
        plugins:
          "image link code codesample table lists wordcount autosave save autolink insertdatetime preview media fullscreen quickbars print template", //就可以增加上面引入的插件，加入下面这一行就可以在toolbar栏显示相应插件。
        branding: false, //是否禁用“Powered by TinyMCE”
        toolbar: [
          {
            name: "history",
            items: ["undo", "redo"],
          },
          {
            name: "styles",
            items: ["styleselect"],
          },
          {
            name: "code",
            items: ["codesample"],
          },
          {
            name: "formatting",
            items: ["bold", "italic", "underline", "strikethrough"],
          },
          {
            name: "fonts",
            items: ["fontselect", "fontsizeselect"],
          },
          {
            name: "colors",
            items: ["forecolor", "backcolor"],
          },
          // {
          //   name:"file",
          //   items: ["insertfile"]
          // },
          {
            name: "media&link",
            items: ["link", "image", "media"],
          },
          {
            name: "alignment",
            items: ["alignleft", "aligncenter", "alignright", "alignjustify"],
          },
          {
            name: "indentation",
            items: ["outdent", "indent"],
          },
          {
            name: "blockquote",
            items: ["blockquote"],
          },
          {
            name: "table",
            items: ["table"],
          },
          {
            name: "lists",
            items: ["numlist", "bullist"],
          },
          {
            name: "tools",
            items: ["preview", "print", "fullscreen"],
          },
        ],
        //toolbar: "undo redo | fontselect fontsizeselect link autolink lineheight | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | image imagetools | code | h1 h2 h3 h4 h5 blockquote table numlist bullist outdent indent preview fullscreen", //工具栏
        // toolbar_groups: {
        //     formatting: {
        //     icon: 'bold',
        //     tooltip: 'Formatting',
        //     items: 'bold italic underline | superscript subscript'
        //     }
        // },
        toolbar_mode: "sliding",
        toolbar_sticky: true,
        paste_data_images: true, // 允许粘贴图像
        image_caption: true,
        images_upload_handler: (blobInfo, success, failure, progress) => {
          this.uploadFile(blobInfo, success, failure);
        },
        // file_picker_callback: function(callback, value, meta) {
        //   // Provide file and text for the link dialog
        //   if (meta.filetype == 'file') {
        //     callback('mypage.html', {text: 'My text'});
        //   }

        //   // Provide image and alt text for the image dialog
        //   if (meta.filetype == 'image') {
        //     callback('myimage.jpg', {alt: 'My alt text'});
        //   }

        //   // Provide alternative source and posted for the media dialog
        //   if (meta.filetype == 'media') {
        //     callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
        //   }
        // },
        //file_picker_callback: "",
        fontsize_formats:
          "8px 10px 12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        // lineheight_formats: '1 1.1 1.2 1.3 1.4 1.5 2',
        // link_list: [
        // { title: '预置链接1', value: 'http://www.tinymce.com' },
        // { title: '预置链接2', value: 'http://tinymce.ax-z.cn' }
        // ],
        // image_list: [
        // { title: '预置图片1', value: 'https://www.tiny.cloud/images/glyph-tinymce@2x.png' },
        // { title: '预置图片2', value: 'https://www.baidu.com/img/bd_logo1.png' }
        // ],
        // image_class_list: [
        // { title: 'None', value: '' }
        // // { title: 'Some class', value: 'class-name' }
        // ],
        tabfocus_elements: ":prev,:next",
        // importcss_append: true,
        textpattern_patterns: [
          { start: "*", end: "*", format: "italic" },
          { start: "**", end: "**", format: "bold" },
          { start: "#", format: "h1" },
          { start: "##", format: "h2" },
          { start: "###", format: "h3" },
          { start: "####", format: "h4" },
          { start: "#####", format: "h5" },
          { start: "######", format: "h6" },
          { start: "1. ", cmd: "InsertOrderedList" },
          { start: "* ", cmd: "InsertUnorderedList" },
          { start: "- ", cmd: "InsertUnorderedList" },
        ],
        setup: (editor) => {
          editor.on("blur", function () {
            /**
             **本来设想是直接使用编辑器本身的绑定事件来实现需求，
             **后面发现移动端上没有触发编辑器上的blur事件
             **下面的操作没有触发
             **/
            self.focusOutEditor();
          });
          editor.on("focus", function () {
            /**
             **本来设想是直接使用编辑器本身的绑定事件来实现需求，
             **后面发现移动端上没有触发编辑器上的blur事件
             **下面的操作没有触发
             **/
            self.focusOnEditor();
          });
          // 自定义toolbar按钮，需要在toolbar添加
          editor.ui.registry.addButton("testBtn", {
            text: `按钮文字`,
            tooltip: "按钮提示",
            onAction: () =>
              editor.insertContent(
                '<a href="https://www.geekplus.xyz" target="_blank">test text</a>'
              ),
          });
        },
      },
    };
  },
  //   init: {
  //     setup: (Editor) => {
  //       // 初次化编辑器
  //       Editor.on("init", () => {
  //         Editor.setContent(this.value);
  //       });
  //     },
  //   },
  watch: {
    value(newVal) {
      //this.content = newValue;
      //用户vue绑定回显
      //if (this.isInit) {
      //this.isInit = false;
      //this.getContent();
      //   this.$nextTick(() => {
      //     const editor = tinymce.get("tinymce");
      //     editor.activeEditor.getContent()
      //     editor.setContent(newVal);
      //   });
      //}
      this.content = newVal;
    },
    content(newValue) {
      this.$emit("input", newValue);
      //console.log(newValue);
    },
  },
  //获取焦点光标到最后面keepLastIndex (obj, window) {if (window.getSelection) { //ie11 10 9 ff safariobj.focus(); //解决ff不获取焦点无法定位问题var range = window.getSelection(); //创建rangerange.selectAllChildren(obj); //range 选择obj下所有子内容range.collapseToEnd(); //光标移至最后} else if (document.selection) { //ie10 9 8 7 6 5var range = document.selection.createRange(); //创建选择对象range.moveToElementText(obj); //range定位到objrange.collapse(false); //光标移至最后range.select();}}
  mounted() {
    // tinymce.setup((editor) => {
    // });
    tinymce.init({});
    this.$nextTick(() => {
      var tinymceEditor = document.getElementById("tinymce");
      //   this.keepLastIndex(
      //     ifra.contentWindow.document.getElementById("tinymce")
      //   );
    });
  },
  methods: {
    // file_picker_callback: function(callback, value, meta) {
    //     // Provide file and text for the link dialog
    //     if (meta.filetype == 'file') {
    //         callback('mypage.html', {text: 'My text'});
    //     }
    //     // Provide image and alt text for the image dialog
    //     if (meta.filetype == 'image') {
    //         callback('myimage.jpg', {alt: 'My alt text'});
    //     }
    //     // Provide alternative source and posted for the media dialog
    //     if (meta.filetype == 'media') {
    //         callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
    //     }
    // },
    getContent() {
      var cnt = tinymce.editors["tinymce"].getContent();
      //console.log(cnt);
    },
    //自定义上传函数
    uploadFile(blobInfo, success, failure, progress) {
      let formData = new FormData();
      formData.append("file", blobInfo.blob());
      uploadFile(formData)
        .then((response) => {
          //console.log(response);
          var serverUrl = response.url;
          let uploadSuccess = {};
          const imageUrl =
            "https://www.geekplus.xyz" + this.baseApi + serverUrl;
          // this.$message({
          //   message: "上传" + response.msg,
          //   type: "success",
          // });
          // 获取返回的图片路径，固定格式为：{location:url}
          let getImgUrl = { location: imageUrl };
          success(imageUrl);
          // this.content += url
          uploadSuccess = { filePath: serverUrl };
          this.allImageList.push(uploadSuccess);
        })
        .catch((error) => {
          //console.log(error);
          failure("Invalid JSON: " + error.msg);
          this.$message({
            message: error.msg,
            type: "error",
            showClose: true,
          });
        });
    },
    focusOutEditor() {
      // console.log("失去焦点");
      let tempImageList = [];
      //this.allImageList = [];
      let deleteImages = [];
      let length = document.querySelectorAll(".ql-editor img").length;
      if (length) {
        let images = document.querySelectorAll(".ql-editor img");
        images.forEach((item) => {
          tempImageList.push({ filePath: this.getServerFilePath(item.src) });
        });
      }
      deleteImages = this.allImageList.filter((item) => {
        return tempImageList.every((e) => e.filePath != item.filePath);
        //return tempImageList.indexOf(item) === -1
      });
      // console.log(tempImageList);
      // console.log(this.allImageList);
      // console.log(deleteImages);
      if (deleteImages.length > 0) {
        this.removeFileList(deleteImages);
      }
      let allTempImg = this.allImageList.filter((item) => {
        return deleteImages.every((e) => e.filePath != item.filePath);
      });
      // console.log(deleteImages);
      // console.log(allTempImg);
      this.allImageList = allTempImg;
    },
    focusOnEditor() {
      // console.log("得到焦点");
    },
  },
  destroyed() {},
};
</script>

<style>
</style>