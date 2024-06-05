
jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる
  //ドロワーメニュー
  $(".js-hamburger, .js-sp-nav").click(function () {
    if ($(".js-hamburger").hasClass('is-active')) {
      $(".js-hamburger").removeClass("is-active");
      $('body, html').css('overflow', 'auto');
      $('.js-header').removeClass("is-active");
      $(".js-sp-nav").fadeOut(300);
    } else {
      $(".js-hamburger").addClass("is-active");
      $('body, html').css('overflow', 'hidden');  // 動画レビュー：ドロワーを開いたときは後ろがスクロールしないようにする
      $('.js-header').addClass('is-active');  // 動画レビュー：ロゴとメニューの文字が被らないように背景色を指定
      $(".js-sp-nav").fadeIn(300);
    }
  });

  // 画面幅のサイズが変わったら
  $(window).on('resize', function () {
    // FB：追加 ∵iOSでは縦スクロールすると画面幅が変わったと認識してresizeイベントが作動してしまう
    if (window.matchMedia("(min-width: 768px)").matches) {

      // xマークを三マークにする（.js-hamburgerの要素にクラス名is-activeがあれば削除する）
      // 動画レビュー：ロゴとメニューの文字が被らないようにした背景色を元に戻す
      $('.js-hamburger, .js-header').removeClass('is-active');

      // .js-sp-navを閉じる（.js-sp-navが表示されていれば非表示にする）
      $('.js-sp-nav').fadeOut(300);
    }
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
    // autoplay: {
    //   speed: 1000,
    //   disableOnInteraction: false   // falseを設定すると、自動再生はユーザーの操作（スワイプ）後に無効にならず、操作後に毎回再起動される
    // },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });

  // 背景色の後に画像が表示されるエフェクト
  //要素の取得とスピードの設定
  var box = $('.js-colorbox'),
    speed = 700;

  //.js-colorboxの付いた全ての要素に対して下記の処理を行う
  box.each(function () {
    $(this).append('<div class="color"></div>')
    var color = $(this).find($('.color')),
      image = $(this).find('img');
    var counter = 0;

    image.css('opacity', '0');
    color.css('width', '0%');
    //inviewを使って背景色が画面に現れたら処理をする
    color.on('inview', function () {
      if (counter == 0) {
        $(this).delay(200).animate({ 'width': '100%' }, speed, function () {
          image.css('opacity', '1');
          $(this).css({ 'left': '0', 'right': 'auto' });
          $(this).animate({ 'width': '0%' }, speed);
        });
        counter = 1;
      }
    });
  });

  // スクロールしながらページトップへ戻るボタン
  let topBtn = $('.js-to-top');
  topBtn.hide();

  // ボタンの表示設定
  $(window).scroll(function () {
    if ($(this).scrollTop() > 70) {
      // 指定px以上のスクロールでボタンを表示
      topBtn.fadeIn();
    } else {
      // 画面が指定pxより上ならボタンを非表示
      topBtn.fadeOut();
    }
  });

  // ボタンをクリックしたらスクロールして上に戻る
  topBtn.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 300, 'swing');
    return false;
  });

  // Contactセクションの右下でボタンが止まる
  $('.js-to-top').hide();
  $(window).on('scroll', function () {
    let documentHeight = $(document).height(); // ドキュメント全体の高さ
    let wHeight = $(window).height(); // ブラウザの表示領域の高さ
    let scrollAmount = $(window).scrollTop(); // スクロールした距離
    let footerHeight = $('.js-footer').innerHeight(); // フッターの高さ(padding含む)
    let browserWidth = window.outerWidth;
    if (documentHeight - (wHeight + scrollAmount) <= footerHeight) {
      // ページトップへ戻るボタンがフッターの直前に来たら、positionプロパティの値をfixedからabsoluteに変更する
      if (browserWidth < 768) {
        $('.js-to-top').css({
          position: 'absolute',
          bottom: footerHeight + 16
        });
      } else {
        $('.js-to-top').css({
          position: 'absolute',
          bottom: footerHeight + 20
        });
      }
    } else {
      if (browserWidth < 768) {
        $('.js-to-top').css({
          position: 'fixed',
          bottom: '16px'
        });
      } else {
        $('.js-to-top').css({
          position: 'fixed',
          bottom: '20px'
        });
      }
    }
  });

  // 変数に要素をセット
  var $filter = $('.js-filter-list [data-filter]'),
      $item = $('.js-filter-item [data-item]');
    
  // カテゴリをクリックしたら
  $filter.click(function (e) {
    // デフォルトの動作をキャンセル
    e.preventDefault();
    var $this = $(this);
      
    // クリックしたカテゴリにクラスを付与
    $filter.removeClass('is-active');
    $this.addClass('is-active');
    
    // クリックした要素のdata属性を取得
    var $filterItem = $this.attr('data-filter');
    
    // データ属性が all なら全ての要素を表示
    if ($filterItem == 'all') {
      $item.removeClass('is-active').fadeOut().promise().done(function () {
        $item.addClass('is-active').fadeIn();
      });
    // all 以外の場合は、クリックした要素のdata属性の値と同じ値のアイテムを表示
    } else {
      $item.removeClass('is-active').fadeOut().promise().done(function () {
        $item.filter('[data-item = "' + $filterItem + '"]').addClass('is-active').fadeIn();
      });
    }
  });
});
