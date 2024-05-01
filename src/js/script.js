
jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる
  //ドロワーメニュー
  $(".js-hamburger, .js-sp-nav").click(function () {
    if ($(".js-hamburger").hasClass('is-active')) {
      $(".js-hamburger").removeClass("is-active");
      $(".js-sp-nav").fadeOut(300);
    } else {
      $(".js-hamburger").addClass("is-active");
      $(".js-sp-nav").fadeIn(300);
    }
  });

  // 画面幅のサイズが変わったら
  $(window).on('resize', function () {

    // xマークを三マークにする（.js-hamburgerの要素にクラス名is-activeがあれば削除する）
    $('.js-hamburger').removeClass('is-active');

    // .js-sp-navを閉じる（.js-sp-navが表示されていれば非表示にする）
    $('.js-sp-nav').fadeOut(300);
  });

  // mvスワイパー
  const mv_swiper = new Swiper('.js-mv-swiper', {
    loop: true,
    effect: 'fade',
    speed: 3000, // スライド（フェイド）が変わるスピード
    allowTouchMove: false, // 3秒(delay: 3000)たつ前にマウスでカチャカチャなぞることによって次のスライドへ移るのをさせないようにする（これがないとクリックで自分でスライドできてしまう）
    autoplay: {
      delay: 3000 // 3秒後にスライドが変わっていく
    },
  });

  // campaignスワイパー
  const campaign_swiper = new Swiper('.js-campaign-swiper', {
    slidesPerView: 'auto',
    loop: true,
    speed: 1000,
    spaceBetween: 24,
    breakpoints: {
      768: {
        spaceBetween: 40
      }
    },
    autoplay: {
      speed: 1000,
      disableOnInteraction: false   // falseを設定すると、自動再生はユーザーの操作（スワイプ）後に無効にならず、操作後に毎回再起動される
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });

});
