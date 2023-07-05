import Vue from 'vue'

Vue.prototype.$showSuccessToast = showSuccessToast
Vue.prototype.$showErrorToast = showErrorToast
Vue.prototype.$showInfoToast = showInfoToast
Vue.prototype.$showWarningToast = showWarningToast
Vue.prototype.$showValidationToast = showValidationToast
Vue.prototype.$showProgressToast = showProgressToast

const toastObj = {
  position: 'top-end',
  icon: 'success',
  showConfirmButton: false,
  title: '',
  // showCancelButton: true,
  toast: true,
  // background: '#ff0000',
  timer: 3000,
  timerProgressBar: true,
  // showClass: {
  //   popup: 'animated fadeInDown faster'
  // },
  // hideClass: {
  //   popup: 'animated fadeOutUp faster'
  // },
  onOpen: (toast) => {}
}
const progressToast = {
  showConfirmButton: false,
  title: 'Please Wait...',
  html: '<progress></progress>',
  // timer: 5000,
  // showCancelButton: true,
  // background: '#ff0000',
  // showClass: {
  //   popup: 'animated fadeInDown faster'
  // },
  // hideClass: {
  //   popup: 'animated fadeOutUp faster'
  // },
  didOpen: (toast) => {}
}

function showSuccessToast(self, message) {
  toastObj.icon = 'success'
  toastObj.title = message
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showErrorToast(self, message) {
  toastObj.icon = 'error'
  toastObj.title = message
  toastObj.timer = 6000
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showWarningToast(self, message) {
  toastObj.icon = 'warning'
  toastObj.title = message
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showInfoToast(self, message) {
  toastObj.icon = 'info'
  toastObj.title = message
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showQuestionToast(self, message) {
  toastObj.icon = 'question'
  toastObj.title = message
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showValidationToast(self, message) {
  toastObj.icon = 'info'
  toastObj.title = message
  toastObj.position = 'top'
  toastObj.showConfirmButton = 'true'
  toastObj.onOpen = (toast) => {
    toast.addEventListener('mouseenter', self.$swal.stopTimer)
    toast.addEventListener('mouseleave', self.$swal.resumeTimer)
  }
  self.$swal(toastObj)
}

function showProgressToast(self, message, time = 0) {
  progressToast.title = message
  progressToast.didOpen = (toast) => {}
  if (time) {
    progressToast.timer = time
  }
  self.$swal(progressToast)
}
