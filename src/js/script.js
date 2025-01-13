"use strict";

var mv_swiper;

jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる
  // ヘッダークラス名付与
  let header = $('.js-header');
  let headerheight = $('.js-header').height();
  let height = $('.js-mv-height').height();
  console.log('ヘッダーの高さ：' + headerheight);
  console.log('メインビューの高さ：' + height);
  console.log(height - headerheight);
  $(window).scroll(function () {
    if ($(this).scrollTop() > (height - headerheight)) {
      header.addClass('is-color');
    } else {
      header.removeClass('is-color');
    }
  });

  //ドロワーメニュー
  $('.js-hamburger, .js-sp-nav').click(function () {
    if ($('.js-hamburger').hasClass('is-active')) {
      $('.js-hamburger').removeClass('is-active');
      $('body, html').css('overflow', 'auto');
      $('.js-header').removeClass('is-active');
      $('.js-sp-nav').fadeOut(300);
    } else {
      $('.js-hamburger').addClass('is-active');
      $('body, html').css('overflow', 'hidden');  // 動画レビュー：ドロワーを開いたときは後ろがスクロールしないようにする
      $('.js-header').addClass('is-active');  // 動画レビュー：ロゴとメニューの文字が被らないように背景色を指定
      $('.js-sp-nav').fadeIn(300);
    }
  });

  // 画面幅のサイズが変わったら
  $(window).on('resize', function () {
    // FB：追加 ∵iOSでは縦スクロールすると画面幅が変わったと認識してresizeイベントが作動してしまう
    if (window.matchMedia('(min-width: 768px)').matches) {

      // xマークを三マークにする（.js-hamburgerの要素にクラス名is-activeがあれば削除する）
      // 動画レビュー：ロゴとメニューの文字が被らないようにした背景色を元に戻す
      $('.js-hamburger, .js-header').removeClass('is-active');

      // .js-sp-navを閉じる（.js-sp-navが表示されていれば非表示にする）
      $('.js-sp-nav').fadeOut(300);
    }
  });

  // スワイパーの自動再生を一時停止
  mv_swiper = new Swiper('.js-mv-swiper', { // ここで「var」を削除して、グローバルに宣言したmv_swiperを使用
    loop: true,
    effect: 'fade',
    speed: 3000, // スライド（フェイド）が変わるスピード
    allowTouchMove: false, // 3秒(delay: 3000)たつ前にマウスでカチャカチャなぞることによって次のスライドへ移るのをさせないようにする（これがないとクリックで自分でスライドできてしまう）
    autoplay: false // 最初は自動再生をしない
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

  // ボックスシャドウを更新する関数
  function updateBoxShadow() {
    let browserW = window.innerWidth;
    if (browserW >= 768) {
      $('.tab__item').each(function() {
        if (!$(this).hasClass('is-active')) {
          $(this).css('box-shadow', 'none');
        } else {
          $(this).css('box-shadow', '0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.25)'); // 元のスタイルを指定
        }
      });
    }
  }

  // 最初に表示されるタブの設定
  $('.information-cards__item:first-child').addClass('is-active');
  $('.tab__item:first-child').addClass('is-active');

  // タブによる切り替え
  const tabButton = $(".js-tab-item"),
    tabContent = $(".js-tab-content");
  tabButton.on("click", function () {
    let index = tabButton.index(this);

    tabButton.removeClass("is-active");
    $(this).addClass("is-active");
    tabContent.removeClass("is-active");
    tabContent.eq(index).addClass("is-active");

    updateBoxShadow();
  });

  // 初期状態のボックスシャドウを更新
  updateBoxShadow();

  // ウィンドウがリサイズされたときにボックスシャドウを更新
  $(window).resize(function() {
    updateBoxShadow();
  });

  // タブを選択する関数を定義
  function selectTab(hash) {
    // すべてのタブコンテンツを非表示に("is-active"クラスを削除)する
    $('.js-tab-content').removeClass('is-active');

    // すべてのタブアイテムから"is-active"クラスを削除する
    $('.js-tab-item').removeClass('is-active');

    // ハッシュに対応するタブアイテムに"is-active"クラスを追加する
    $(hash).addClass('is-active');

    // ハッシュに対応するタブコンテンツを表示("is-active"クラスを追加)する
    var contentId = hash + '-content';
    $(contentId).addClass('is-active');
  }

  // ページがロードされたときにURLのハッシュを取得
  var hash = window.location.hash;

  // ハッシュが存在する場合は、そのタブを選択
  if (hash) {
      selectTab(hash);
      updateBoxShadow();
  }

  // フッターまたはドロワーメニューのリンクがクリックされたときの処理
  $('.footer-nav__left-detail-link, .sp-nav__left-detail-link').on('click', function (e) {
      // デフォルトのリンク動作をキャンセル
      // e.preventDefault();

      // クリックされたリンクのハッシュを取得
      var targetHash = this.hash;

      // 該当するタブを選択
      selectTab(targetHash);

      updateBoxShadow();

      // 該当タブまでスクロール
      // $('html, body').animate({
      //     scrollTop: $(targetHash).offset().top
      // }, 500);
  });

  // モーダル
  const open = $('.js-modal-open'),
    modal = $('.js-modal');
  let scrollTop;

  //   スクロールバーの幅を計算する関数
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  //Gallery画像をクリックしたらモーダルを表示する
  open.on('click', function () {
    let imgsrc = $(this).find('img').attr('src');
    $('.modal__img').children().attr('src', imgsrc);
    modal.addClass('is-open');

    // スクロールバーの幅を取得
    const scrollbarWidth = getScrollbarWidth();

    // 背景を固定してスクロールさせない
    scrollTop = $(window).scrollTop();

    $('body').css({
      position: 'fixed',
      top: -scrollTop,
      left: 0,
      // right: 0,
      width: `calc(100% - ${scrollbarWidth}px)` // スクロールバーの幅を考慮する
    });
  });

  //モーダルをクリックしたらモーダルを閉じる
  modal.on("click", function () {
    modal.removeClass("is-open");

    // 背景の固定を解除する
    $('body').css({
      position: '',
      top: '',
      left: '',
      // right: '',
      width: ''
    });

    $(window).scrollTop(scrollTop);
  });

  // トグル
  // $(".js-archive-toggle:first-child .js-archive-toggle-items").css(
  //   "display",
  //   "block"
  // );
  // $(".js-archive-toggle:first-child > .js-archive-toggle-title").addClass("is-open");
  $(".js-archive-toggle-title").on("click", function () {
    $(this).toggleClass("is-open");
    $(this).next().slideToggle(300);
  });

  // アコーディーン
  $(".js-accordion-title").on("click", function () {
    $(this).toggleClass("is-close");
    $(this).next().slideToggle(300);
  });

  // フォームの入力チェック
  if (window.location.pathname.endsWith('page-contact.html')) {
    $('#form__contact').on('submit', function(e) {
      var user_name = $('#form__name').val(); /* お名前 */
      var email = $('#form__email').val(); /* メールアドレス */
      var tel = $('#form__tel').val(); /* 電話番号 */
      var inquiry_checked = $('input[name="inquiry"]:checked').length > 0; /* inquiryのチェックボックス */
      var textarea_value = $('#form__textarea').val(); /* お問合せ内容 */
      var agree_checked = $('input[name="agree"]:checked').length > 0; /* agreeのチェックボックス */

      var error_text = ''; /* エラーの説明が入る変数 */

      // すべてのエラースタイルをリセット
      $('#form__name, #form__email, #form__tel, #form__textarea, #form__checkbox').removeClass('form__error-style');

      if (user_name.trim() === '') {
        error_text = '※必須項目が入力されていません。入力してください。';
        $('#form__name').addClass('form__error-style');
      } else if (email.trim() === '') {
        error_text = '※必須項目が入力されていません。入力してください。';
        $('#form__email').addClass('form__error-style');
      } else if (tel.trim() === '') {
        error_text = '※必須項目が入力されていません。入力してください。';
        $('#form__tel').addClass('form__error-style');
      } else if (!inquiry_checked) {
        error_text = '※必須項目がチェックされていません。チェックしてください。';
      } else if (textarea_value.trim() === '') {
        error_text = '※必須項目が入力されていません。入力してください。';
        $('#form__textarea').addClass('form__error-style');
      } else if (!agree_checked) {
        error_text = '※必須項目がチェックされていません。チェックしてください。';
        $('#form__checkbox').addClass('form__error-style');
      }

      if (error_text !== '') {
        e.preventDefault(); // フォームの送信を止める
        localStorage.setItem('error_text', error_text);
        localStorage.setItem('form_data', JSON.stringify({
          user_name: user_name,
          email: email,
          tel: tel,
          inquiry_checked: $('input[name="inquiry"]:checked').map(function() { return this.value; }).get(),
          textarea_value: textarea_value,
          agree_checked: agree_checked
        }));
        window.location.href = 'error.html';
      } else {

        // 今回はサーバーにデータを送らないのでページ遷移を止める
        e.preventDefault();
        window.location.href = 'thanks.html';

        // エラー内容をクリアする
        // $('#form__error').text('');
      }
    });
  }

  // エラーページの処理
  if (window.location.pathname.endsWith('error.html')) {
    var error_text = localStorage.getItem('error_text');
    if (error_text) {
      $('#form__error').text(error_text); // エラー内容を表示する
      localStorage.removeItem('error_text'); // 表示後にクリア
    }

    var form_data = JSON.parse(localStorage.getItem('form_data'));
    if (form_data) {
      $('#form__name').val(form_data.user_name);
      $('#form__email').val(form_data.email);
      $('#form__tel').val(form_data.tel);

      form_data.inquiry_checked.forEach(function(value) {
        $('input[name="inquiry"][value="' + value + '"]').prop('checked', true);
      });

      $('input[name="agree"]').prop('checked', form_data.agree_checked);
      $('#form__textarea').val(form_data.textarea_value);

      // すべてのエラースタイルをリセット
      $('#form__name, #form__email, #form__tel, #form__textarea, #form__checkbox').removeClass('form__error-style');

      if (form_data.user_name.trim() === '') {
        $('#form__name').addClass('form__error-style');
      } else if (form_data.email.trim() === '') {
        $('#form__email').addClass('form__error-style');
      } else if (form_data.tel.trim() === '') {
        $('#form__tel').addClass('form__error-style');
      } else if (form_data.inquiry_checked.length === 0) {
        // 必要に応じて処理を追加
      } else if (form_data.textarea_value.trim() === '') {
        $('#form__textarea').addClass('form__error-style');
      } else if (!form_data.agree_checked) {
        $('#form__checkbox').addClass('form__error-style');
      }

      localStorage.removeItem('form_data'); // 表示後にクリア
    }
  }
});

// ローディングアニメーション
jQuery(window).on("load", function () {
  jQuery(".js-load").fadeOut(1000, function () {
    // fadeOutを使用してフェード後に非表示に
    jQuery(this).addClass('loaded'); // フェードアウト後に非表示
    // フェードアウト完了後の処理
    // 左右の画像が下からスライド
    jQuery('.js-mv-img-left').addClass('loaded'); // 左の画像をスライドイン

    jQuery('.js-mv-img-right').addClass('loaded'); // 右の画像をスライドイン（80px差で配置済み）

    setTimeout(function () {
      // タイトルを表示
      jQuery('.js-mv-header, .js-header').css('opacity', '1');

      // 2秒後にスワイパーの自動再生を開始
      // autoplayオプションを追加・設定して開始
      // mv_swiper.params.autoplay = {  // この書き方だとスワイパーが止まってしまう！よって、以下の通り1行に書いた
      //   delay: 3000,
      // };
      mv_swiper.params.autoplay.delay = 3000; // 3秒ごとにスライド(3秒後にスライドが変わっていく)
      mv_swiper.autoplay.start(); // 自動再生を開始
    }, 2000);
  });
});
