export default function ({ $axios, redirect }) {
    $axios.onError((error) => {
      const code = parseInt(error.response && error.response.status)
      if (code === 401) {
        try {
          redirect('/signin')
        } catch (error) {
          console.error('debug error ', error)
        }
      }
    })
  }
  