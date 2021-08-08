const titleText = document.querySelector('.title');
const latText = document.querySelector('.lat');
const lngText = document.querySelector('.lng');
const cityText = document.querySelector('.city');
const localityText = document.querySelector('.locality');
const accuracyText = document.querySelector('.accuracy');
// 瀏覽器API 取得當前地理位置
const newWhereAmI = () =>
  new Promise((resolve, reject) => {
    // NOTE 此為設定檔 要在討論
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });

const geoReverse = ([lat, lng, accuracy]) => {
  fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=zh`
  )
    .then(res => res.json())
    .then(data => {
      console.log('--geoReverse Success--');
      console.log(data);
      const { latitude: lat } = data; //所在區域的緯度
      const { longitude: lng } = data; //所在區域的經度
      let { city } = data; //所在城市 e.g.台北市 (因桃園改為市 因此這邊改設為let)
      let { locality } = data; //所在區  e.g. 中正區  (因桃園改為市 因此這邊改設為let)

      // fix 桃園
      if (city === '桃園縣') {
        city = '桃園市';
        locality = locality.slice(0, -1) + '區';
      }

      console.log(lat, lng, city, locality);

      // from newWhereAmI
      latText.innerText = lat.toFixed(3);
      lngText.innerText = lng.toFixed(3);
      accuracyText.innerText = accuracy + ' (米)';
      // from geoReverse
      cityText.innerText = city;
      localityText.innerText = locality;
      // for title
      titleText.innerText = '您的位置是在:';
    });
};

const renderLocationInfo = () => {
  // NOTE 沒有設定reject
  newWhereAmI()
    .then(pos => {
      const { latitude: lat } = pos.coords; // 緯度 -> 重新命名為 lat
      const { longitude: lng } = pos.coords; //經度 -> 重新命名為 lng
      const { accuracy } = pos.coords; //準確度(誤差值) 以meters(公尺)為單位
      //   const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      console.log('By Promise:');
      console.log(`當前緯度: ${lat}`);
      console.log(`當前經度: ${lng}`);
      console.log(`當前誤差值: ${accuracy}(單位米)`);
      // return [lat.toFixed(5), lng.toFixed(5)];
      // return [lat, lng];

      // NOTE 測試用: 加入 誤差值 accuracy
      return [lat, lng, accuracy];
    })
    .then(res => geoReverse(res));
};

const btn = document.querySelector('button');
btn.addEventListener('click', () => {
  titleText.innerText = '計算中';
  renderLocationInfo();
});
