
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
// 
const createRequest = (options = {}) => {
   const xhr = new XMLHttpRequest();
   xhr.responseType = 'json';
   let formData = new FormData();
   let queryParams = '';
   

   if (options.data !== undefined) {
      if (options.method === 'GET') {
        queryParams = '?' + Object.entries(options.data).map(
                ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                ).join('&');
      } else {
        Object.entries(options.data).forEach(v => formData.append(...v));
      }
   } else {
     console.log(xhr.options);
   }

   xhr.onload = () => {
     if (xhr.readyState === XMLHttpRequest.DONE) {
        let err = null;
        let resp = null;

        if (xhr.status === 200) {
           if (xhr.response?.success) {
             resp = xhr.response;
           } else {
            err = xhr.response;
           }
        } else {
            err = new Error('Ошибка');
        }
        if (options.callback) {
       options.callback(err, resp);
           }
        }
     };
     xhr.open(options.method, options.url + queryParams, true);
     xhr.send(formData);

     
     
     
     
   return xhr;
 };

