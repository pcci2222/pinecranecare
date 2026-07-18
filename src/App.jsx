import React, { useState, useEffect, useRef } from "react";

// ---------- Design tokens ----------
const T = {
  ink: "#22403A",        // deep pine — headings, text
  inkSoft: "#5A6E69",    // muted text
  surface: "#F4F6F2",    // soft sage-white page background
  card: "#FFFFFF",
  primary: "#2E6E5E",    // teal-green — buttons, brand
  primaryDark: "#245548",
  amber: "#E8A83E",      // warm amber — highlights, badges
  line: "#DDE4DF",
  danger: "#B4533A",
};

const SERVICE_GROUPS = [
  ["grpSenior", ["Personal care", "Companionship", "Meal preparation", "Medication reminders", "Mobility assistance", "Dementia care"]],
  ["grpChild", ["Child care", "Infant care", "After-school care", "Special needs care"]],
  ["grpHome", ["Light housekeeping", "Laundry", "Errands & shopping", "Transportation", "Pet care"]],
  ["grpExtended", ["Post-surgery care", "Overnight care", "Live-in care", "Respite care"]],
];
const SERVICES = SERVICE_GROUPS.flatMap(([, items]) => items);

const CERTS = ["HHA", "CNA", "CPR / First Aid", "Dementia care training"];

// ---------- Translations (EN / 中文 / Español) ----------
const STRINGS = {
  en: {
    tagline: "松鶴延年 · Trusted home care for every need, near you",
    heroTitle: "Caring hands for daily life",
    heroText: "From senior companionship, meals, and mobility support to child care and after-school help — find a trusted caregiver for your loved ones, whatever their daily needs.",
    join: "+ Join as an aide",
    tabAides: "🔍 Find an aide", tabJobs: "📋 Care requests",
    browseFree: "Browsing is free.", membersContact: "Members can contact any aide directly.",
    seePlans: "See membership plans", memberActive: "Member — expires",
    findTitle: "Find the right caregiver for your loved one",
    findSub: "Search by ZIP code, then narrow by services, rate, and age.",
    searchPh: "Enter ZIP code where care is needed (e.g. 11354)",
    maxRate: "Max $/hr", ageFrom: "Age from", ageTo: "Age to",
    clearFilters: "Clear all filters", allServices: "All services",
    availableSuffix: "aides available", loadingAides: "Loading aides…",
    noAidesTitle: "No aides have joined yet",
    noAidesSub: "Be the first — tap “Join as an aide” to create a profile.",
    noMatchTitle: "No matches for that search",
    noMatchSub: "Try a different city, service, or spelling.",
    viewProfile: "View profile & contact", showLess: "Show less", editBtn: "✎ Edit",
    ageLbl: "Age", yrsExp: "yrs exp", speaks: "Speaks:", certified: "Certified:",
    contactLbl: "Contact:", contactPerson: "Contact",
    lockedLine: "Contact: (•••) •••-•••• — members can call or email any aide directly.",
    unlock: "Unlock contact info",
    pinPrompt: "Enter the 4-digit PIN to continue",
    confirm: "Confirm", cancel: "Cancel", pinBad: "That PIN doesn't match.",
    regTitle: "Create your aide profile",
    regSub: "Fill this out once — families in your area will be able to find you.",
    updTitle: "Update your profile",
    updSub: "Change anything below — your updates go live as soon as you save.",
    selfie: "Take a selfie", retake: "Retake photo", processing: "Processing…",
    cameraNote: "On a phone, this opens your front camera.",
    lName: "Full name", lPhone: "Phone", lEmail: "Email", lCity: "City", lZip: "ZIP",
    lAge: "Age", lYrs: "Yrs experience", lRate: "Rate ($/hr)", lLang: "Languages spoken",
    lServices: "Services you offer", lCerts: "Certifications", lAbout: "About you",
    manageProfile: "Caregiver? Manage my profile ✎",
    aideLoginTitle: "Manage my profile",
    aideLoginSub: "Enter the phone number and 4-digit PIN you used when you registered.",
    aideLoginBtn: "Open my profile",
    aideLoginErr: "No profile found matching that phone number and PIN.",
    pendingEdit: "⏳ Your profile is pending verification — families can't see it yet, but you can update it and it will be reviewed.",
    lCertPhoto: "License / certification photo (optional)",
    certPhotoNote: "Used by Pine Crane Care for verification only — never shown publicly.",
    certUpload: "Add license photo",
    certRetake: "Replace photo",
    lPin: "4-digit PIN (needed to edit or remove your profile later)",
    lPinJob: "4-digit PIN (needed to edit or remove your post later)",
    publish: "Publish my profile", save: "Save changes", saving: "Saving…",
    noteShared: "Note: profiles in this demo are visible to everyone using this app.",
    errReq: "Name, phone, and city are required.",
    errPhoto: "Please add a profile photo — families want to see who they're hiring.",
    errPin: "Please set a 4-digit PIN so you can edit later.",
    errSave: "Could not save. Please try again.",
    errJobReq: "Title, your name, phone, and city are required.",
    jobsIntro: "Families post their needs here — aides reach out directly.",
    postBtn: "+ Post a care request", loadingJobs: "Loading care requests…",
    noJobsTitle: "No care requests yet",
    noJobsSub: "Need care? Post a care request and let aides come to you.",
    openSuffix: "open requests", viewDetails: "View details & contact", postedOn: "posted",
    jfTitle: "Post a care request", jfUpd: "Update your care request",
    jfSub: "Describe what you need — interested aides will contact you directly.",
    lTitle: "Title", lYourName: "Your name", lSchedule: "Schedule needed",
    lOffered: "Offered $/hr", lDetails: "Details",
    detailsPh: "Tell aides about your loved one's needs, language preferences, home environment, etc. Please don't include your street address.",
    publishJob: "Publish care request",
    jobShared: "Your post — including your name and phone — will be visible to everyone using this platform, so aides can reach you. Don't include your street address.",
    plTitle: "Become a member",
    plSub: "Browsing is always free. A membership unlocks every aide's phone number and email, so you can contact as many aides as you need — whether you're nearby or arranging care for a loved one from another state or country.",
    demoText: "Demo checkout: no real payment is collected in this prototype. In the live version, this button opens Stripe's secure payment page — accepting cards from any country, Apple Pay, Google Pay, Alipay (支付宝), and WeChat Pay (微信支付).",
    activate: "Activate demo membership", popular: "MOST POPULAR", back: "← Back",
    benefitsTitle: "Every membership includes:",
    benefit1: "Unlimited caregiver contacts",
    benefit2: "Free replacement matching if your caregiver becomes unavailable",
    benefit3: "Post care requests — let caregivers come to you",
    benefit4: "Write and read verified reviews",
    suName: "Single Unlock", suPrice: "$12.99", suPer: " one-time",
    suBlurb: "Not ready for a membership? Unlock this one caregiver's full profile and contact info.",
    featuredBadge: "★ Featured",
    teaserName: "Verified Caregiver",
    tabAgencies: "🏛️ Agencies",
    noAgencies: "No agency partners are listed yet.",
    advertiseLine: "Licensed home care agency? Advertise on Pine Crane Care — contact support@pinecranecare.com.",
    medicaidTeaser: "Think you may qualify for Medicaid home care? See licensed agencies",
    partnersTitle: "Medicaid & Licensed Agency Partners",
    partnersSub: "Think your loved one may qualify for Medicaid home care? These licensed agencies can help you check eligibility, apply, and receive covered care.",
    sponsoredTag: "Sponsored", partnerCall: "Call", partnerSite: "Website",
    postFeeTitle: "Care request posting fee",
    postFeeNote: "One-time $9.99 fee per posting. Demo checkout — no real payment is collected in this prototype; the live version uses Stripe's secure payment page.",
    payPublish: "Pay $9.99 & publish",
    aideProLocked: "Client contact info is available to Aide Pro members.",
    aideProBtn: "Become Aide Pro — $14.99/month (demo)",
    tAidePro: "Aide Pro active — client contacts unlocked ✓",
    tUnlocked: "Caregiver unlocked ✓",
    plan_monthly: "Monthly", plan_quarterly: "3 Months", plan_annual: "Annual",
    blurb_monthly: "Full access, cancel anytime.",
    blurb_quarterly: "Save 17% — most popular.",
    blurb_annual: "Best value — save 37%.",
    lServicesNeeded: "Services needed",
    grpSenior: "Senior care", grpChild: "Child & family", grpHome: "Household help", grpExtended: "Extended care",
    reviews: "Reviews", writeReview: "Write a review",
    commentPh: "How was the service? Punctuality, care quality, communication…",
    submitReview: "Submit review", noReviews: "No reviews yet.",
    errReview: "Please select a star rating and enter your name.",
    tReview: "Thank you — your review is posted ✓",
    faqTitle: "Frequently Asked Questions", faqClientTitle: "For Families", faqAideTitle: "For Caregivers", faqLink: "FAQ", whyMembership: "Why membership?",
    fPrivacy: "Privacy Policy", fTerms: "Terms of Service", fBackup: "Backup (testing)",
    fCopy: "© 2026 Pine Crane Care. Families are responsible for screening and hiring decisions.",
    tProfileLive: "Your profile has been submitted for review — it will appear in the directory once Pine Crane Care verifies it ✓",
    verifiedBadge: "✓ Verified", tProfileUpd: "Profile updated ✓", tProfileRem: "Profile removed.",
    tJobLive: "Your care request is live! 🎉", tJobUpd: "Care request updated ✓", tJobRem: "Care request removed.",
    tMember: "Membership active — contact info unlocked ✓",
  },
  zh: {
    tagline: "松鶴延年 · 全方位可信賴的居家照護",
    heroTitle: "用心照護，安享日常",
    heroText: "從長者陪伴、備餐、行動輔助，到兒童照護與課後看顧 — 為您的家人找到值得信賴的照護者。",
    join: "+ 看護註冊",
    tabAides: "🔍 尋找看護", tabJobs: "📋 徵求看護",
    browseFree: "瀏覽完全免費。", membersContact: "會員可直接聯繫任何看護。",
    seePlans: "查看會員方案", memberActive: "會員 — 到期日",
    findTitle: "為您的家人找到合適的看護",
    findSub: "先輸入郵遞區號，再依服務、時薪與年齡篩選。",
    searchPh: "輸入需要照護地區的郵遞區號（例：11354）",
    maxRate: "時薪上限", ageFrom: "年齡從", ageTo: "至",
    clearFilters: "清除所有篩選", allServices: "全部服務",
    availableSuffix: "位看護", loadingAides: "載入中…",
    noAidesTitle: "目前還沒有看護加入",
    noAidesSub: "成為第一位 — 點選「看護註冊」建立檔案。",
    noMatchTitle: "沒有符合的結果",
    noMatchSub: "請嘗試其他城市、服務或關鍵字。",
    viewProfile: "查看檔案與聯絡方式", showLess: "收起", editBtn: "✎ 編輯",
    ageLbl: "年齡", yrsExp: "年經驗", speaks: "語言：", certified: "證照：",
    contactLbl: "聯絡方式：", contactPerson: "聯絡",
    lockedLine: "聯絡方式：(•••) •••-•••• — 會員可直接致電或發郵件給任何看護。",
    unlock: "解鎖聯絡方式",
    pinPrompt: "請輸入 4 位數 PIN 碼以繼續",
    confirm: "確認", cancel: "取消", pinBad: "PIN 碼不正確。",
    regTitle: "建立看護檔案",
    regSub: "只需填寫一次 — 您附近的家庭就能找到您。",
    updTitle: "更新您的檔案",
    updSub: "修改以下內容 — 儲存後立即生效。",
    selfie: "自拍照片", retake: "重拍", processing: "處理中…",
    cameraNote: "手機上會開啟前置鏡頭。",
    lName: "姓名", lPhone: "電話", lEmail: "電子郵件", lCity: "城市", lZip: "郵遞區號",
    lAge: "年齡", lYrs: "經驗年數", lRate: "時薪（美元）", lLang: "會說的語言",
    lServices: "提供的服務", lCerts: "證照", lAbout: "自我介紹",
    manageProfile: "我是照護者？管理我的檔案 ✎",
    aideLoginTitle: "管理我的檔案",
    aideLoginSub: "請輸入註冊時使用的電話號碼與 4 位數 PIN 碼。",
    aideLoginBtn: "開啟我的檔案",
    aideLoginErr: "找不到符合該電話與 PIN 碼的檔案。",
    pendingEdit: "⏳ 您的檔案正在審核中 — 家庭目前看不到，但您可以更新內容，我們將一併審核。",
    lCertPhoto: "證照照片（選填）",
    certPhotoNote: "僅供松鶴護理驗證使用 — 不會公開顯示。",
    certUpload: "上傳證照照片",
    certRetake: "重新上傳",
    lPin: "4 位數 PIN 碼（日後編輯或刪除檔案時需要）",
    lPinJob: "4 位數 PIN 碼（日後編輯或刪除貼文時需要）",
    publish: "發布我的檔案", save: "儲存變更", saving: "儲存中…",
    noteShared: "注意：此示範版的檔案對所有使用者可見。",
    errReq: "姓名、電話與城市為必填。",
    errPhoto: "請上傳照片 — 家庭希望看到看護的樣子。",
    errPin: "請設定 4 位數 PIN 碼，以便日後編輯。",
    errSave: "儲存失敗，請再試一次。",
    errJobReq: "標題、稱呼、電話與城市為必填。",
    jobsIntro: "家庭在此發布需求 — 看護會直接與您聯繫。",
    postBtn: "+ 發布徵求", loadingJobs: "載入中…",
    noJobsTitle: "目前沒有徵求資訊",
    noJobsSub: "需要照護？發布徵求，讓看護主動聯繫您。",
    openSuffix: "則徵求", viewDetails: "查看詳情與聯絡方式", postedOn: "發布於",
    jfTitle: "發布照護徵求", jfUpd: "更新徵求內容",
    jfSub: "描述您的需求 — 有興趣的看護會直接聯繫您。",
    lTitle: "標題", lYourName: "您的稱呼", lSchedule: "需要的時段",
    lOffered: "提供時薪", lDetails: "詳細說明",
    detailsPh: "說明家人的照護需求、語言偏好、居家環境等。請勿填寫詳細住址。",
    publishJob: "發布徵求",
    jobShared: "您的貼文（含姓名與電話）將對所有使用者公開，方便看護與您聯繫。請勿填寫詳細住址。",
    plTitle: "成為會員",
    plSub: "瀏覽永遠免費。成為會員即可解鎖所有看護的電話與郵件 — 無論您在本地，或在外州、海外為家人安排照護。",
    demoText: "示範結帳：本原型不會收取任何費用。正式版將開啟 Stripe 安全付款頁面 — 支援各國信用卡、Apple Pay、Google Pay、支付寶與微信支付。",
    activate: "啟用示範會員", popular: "最受歡迎", back: "← 返回",
    benefitsTitle: "所有會員方案皆包含：",
    benefit1: "無限次聯繫照護者",
    benefit2: "照護者無法繼續時，免費重新配對",
    benefit3: "發布照護徵求 — 讓照護者主動聯繫您",
    benefit4: "撰寫並查看真實評價",
    suName: "單次解鎖", suPrice: "$12.99", suPer: " 一次性",
    suBlurb: "還不想加入會員？單次解鎖這位照護者的完整檔案與聯絡方式。",
    featuredBadge: "★ 精選",
    teaserName: "已驗證照護者",
    tabAgencies: "🏛️ 照護機構",
    noAgencies: "目前尚無機構夥伴。",
    advertiseLine: "您是持牌居家照護機構？歡迎在松鶴護理刊登廣告 — 請聯繫 support@pinecranecare.com。",
    medicaidTeaser: "家人可能符合 Medicaid 資格？查看持牌機構",
    partnersTitle: "Medicaid 與持牌機構夥伴",
    partnersSub: "您的家人可能符合 Medicaid 居家照護資格？這些持牌機構可協助您確認資格、提出申請並獲得保險給付的照護。",
    sponsoredTag: "贊助", partnerCall: "致電", partnerSite: "網站",
    postFeeTitle: "徵求發布費",
    postFeeNote: "每則徵求一次性收費 $9.99。示範結帳 — 原型不會實際收費；正式版將使用 Stripe 安全付款頁面。",
    payPublish: "支付 $9.99 並發布",
    aideProLocked: "客戶聯絡方式僅限 Aide Pro 會員查看。",
    aideProBtn: "成為 Aide Pro — 每月 $14.99（示範）",
    tAidePro: "Aide Pro 已啟用 — 客戶聯絡方式已解鎖 ✓",
    tUnlocked: "已解鎖照護者 ✓",
    plan_monthly: "月繳", plan_quarterly: "季繳（3 個月）", plan_annual: "年繳",
    blurb_monthly: "完整功能，隨時取消。",
    blurb_quarterly: "省 17% — 最受歡迎。",
    blurb_annual: "最划算 — 省 37%。",
    lServicesNeeded: "需要的服務",
    grpSenior: "長者照護", grpChild: "兒童與家庭", grpHome: "家務協助", grpExtended: "進階照護",
    reviews: "評價", writeReview: "撰寫評價",
    commentPh: "服務如何？守時、照護品質、溝通…",
    submitReview: "送出評價", noReviews: "目前還沒有評價。",
    errReview: "請選擇星等並填寫稱呼。",
    tReview: "感謝您 — 評價已發布 ✓",
    faqTitle: "常見問題", faqClientTitle: "給家庭（客戶）", faqAideTitle: "給照護者", faqLink: "常見問題", whyMembership: "為何要加入會員？",
    fPrivacy: "隱私政策", fTerms: "服務條款", fBackup: "備份（測試用）",
    fCopy: "© 2026 Pine Crane Care 松鶴護理。家庭須自行負責審核與聘用決定。",
    tProfileLive: "您的檔案已送出審核 — 通過驗證後將顯示於名錄中 ✓",
    verifiedBadge: "✓ 已驗證", tProfileUpd: "檔案已更新 ✓", tProfileRem: "檔案已刪除。",
    tJobLive: "您的徵求已發布！🎉", tJobUpd: "徵求已更新 ✓", tJobRem: "徵求已刪除。",
    tMember: "會員已啟用 — 聯絡方式已解鎖 ✓",
  },
  es: {
    tagline: "松鶴延年 · Cuidado a domicilio de confianza para toda necesidad",
    heroTitle: "Manos que cuidan la vida diaria",
    heroText: "Desde compañía para mayores y apoyo de movilidad hasta cuidado infantil y ayuda después de clases — encuentre un cuidador de confianza para su familia.",
    join: "+ Soy cuidador/a",
    tabAides: "🔍 Buscar cuidador", tabJobs: "📋 Solicitudes",
    browseFree: "Navegar es gratis.", membersContact: "Los miembros pueden contactar a cualquier cuidador.",
    seePlans: "Ver planes de membresía", memberActive: "Miembro — vence",
    findTitle: "Encuentre el cuidador ideal para su ser querido",
    findSub: "Busque por código postal y filtre por servicios, tarifa y edad.",
    searchPh: "Ingrese el código postal donde se necesita cuidado (ej. 11354)",
    maxRate: "Máx $/hora", ageFrom: "Edad desde", ageTo: "hasta",
    clearFilters: "Borrar filtros", allServices: "Todos los servicios",
    availableSuffix: "cuidadores disponibles", loadingAides: "Cargando…",
    noAidesTitle: "Aún no hay cuidadores",
    noAidesSub: "Sea el primero — toque «Soy cuidador/a» para crear su perfil.",
    noMatchTitle: "Sin resultados",
    noMatchSub: "Pruebe otra ciudad, servicio u ortografía.",
    viewProfile: "Ver perfil y contacto", showLess: "Ver menos", editBtn: "✎ Editar",
    ageLbl: "Edad", yrsExp: "años exp.", speaks: "Habla:", certified: "Certificado:",
    contactLbl: "Contacto:", contactPerson: "Contactar a",
    lockedLine: "Contacto: (•••) •••-•••• — los miembros pueden llamar o escribir a cualquier cuidador.",
    unlock: "Desbloquear contacto",
    pinPrompt: "Ingrese el PIN de 4 dígitos para continuar",
    confirm: "Confirmar", cancel: "Cancelar", pinBad: "El PIN no coincide.",
    regTitle: "Cree su perfil de cuidador",
    regSub: "Complételo una vez — las familias de su zona podrán encontrarlo.",
    updTitle: "Actualice su perfil",
    updSub: "Cambie lo que necesite — se publica al guardar.",
    selfie: "Tomar una selfie", retake: "Repetir foto", processing: "Procesando…",
    cameraNote: "En el teléfono, abre la cámara frontal.",
    lName: "Nombre completo", lPhone: "Teléfono", lEmail: "Correo", lCity: "Ciudad", lZip: "Código postal",
    lAge: "Edad", lYrs: "Años de experiencia", lRate: "Tarifa ($/h)", lLang: "Idiomas",
    lServices: "Servicios que ofrece", lCerts: "Certificaciones", lAbout: "Sobre usted",
    manageProfile: "¿Cuidador/a? Administrar mi perfil ✎",
    aideLoginTitle: "Administrar mi perfil",
    aideLoginSub: "Ingrese el número de teléfono y el PIN de 4 dígitos que usó al registrarse.",
    aideLoginBtn: "Abrir mi perfil",
    aideLoginErr: "No se encontró un perfil con ese teléfono y PIN.",
    pendingEdit: "⏳ Su perfil está pendiente de verificación — las familias aún no lo ven, pero puede actualizarlo.",
    lCertPhoto: "Foto de licencia / certificación (opcional)",
    certPhotoNote: "Solo para verificación de Pine Crane Care — nunca se muestra públicamente.",
    certUpload: "Agregar foto de licencia",
    certRetake: "Reemplazar foto",
    lPin: "PIN de 4 dígitos (para editar o eliminar su perfil después)",
    lPinJob: "PIN de 4 dígitos (para editar o eliminar su publicación después)",
    publish: "Publicar mi perfil", save: "Guardar cambios", saving: "Guardando…",
    noteShared: "Nota: en esta demo los perfiles son visibles para todos.",
    errReq: "Nombre, teléfono y ciudad son obligatorios.",
    errPhoto: "Agregue una foto — las familias quieren ver a quién contratan.",
    errPin: "Establezca un PIN de 4 dígitos para poder editar después.",
    errSave: "No se pudo guardar. Intente de nuevo.",
    errJobReq: "Título, nombre, teléfono y ciudad son obligatorios.",
    jobsIntro: "Las familias publican sus necesidades — los cuidadores las contactan directamente.",
    postBtn: "+ Publicar solicitud", loadingJobs: "Cargando…",
    noJobsTitle: "Aún no hay solicitudes",
    noJobsSub: "¿Necesita cuidado? Publique una solicitud y deje que los cuidadores lo contacten.",
    openSuffix: "solicitudes abiertas", viewDetails: "Ver detalles y contacto", postedOn: "publicado",
    jfTitle: "Publicar una solicitud de cuidado", jfUpd: "Actualizar su solicitud",
    jfSub: "Describa lo que necesita — los cuidadores interesados lo contactarán.",
    lTitle: "Título", lYourName: "Su nombre", lSchedule: "Horario necesario",
    lOffered: "Tarifa ofrecida $/h", lDetails: "Detalles",
    detailsPh: "Describa las necesidades de su ser querido, idiomas preferidos, entorno del hogar, etc. No incluya su dirección exacta.",
    publishJob: "Publicar solicitud",
    jobShared: "Su publicación (nombre y teléfono incluidos) será visible para todos, para que los cuidadores puedan contactarlo. No incluya su dirección exacta.",
    plTitle: "Hágase miembro",
    plSub: "Navegar siempre es gratis. La membresía desbloquea el teléfono y correo de todos los cuidadores — esté cerca o coordinando el cuidado desde otro estado o país.",
    demoText: "Pago de demostración: este prototipo no cobra nada. En la versión real se abrirá la página segura de Stripe — tarjetas de cualquier país, Apple Pay, Google Pay, Alipay y WeChat Pay.",
    activate: "Activar membresía demo", popular: "MÁS POPULAR", back: "← Volver",
    benefitsTitle: "Toda membresía incluye:",
    benefit1: "Contactos ilimitados con cuidadores",
    benefit2: "Reemplazo gratuito si su cuidador deja de estar disponible",
    benefit3: "Publique solicitudes — deje que los cuidadores lo contacten",
    benefit4: "Escriba y lea reseñas verificadas",
    suName: "Desbloqueo Único", suPrice: "$12.99", suPer: " pago único",
    suBlurb: "¿No está listo para una membresía? Desbloquee el perfil completo y contacto de este cuidador.",
    featuredBadge: "★ Destacado",
    teaserName: "Cuidador Verificado",
    tabAgencies: "🏛️ Agencias",
    noAgencies: "Aún no hay agencias asociadas.",
    advertiseLine: "¿Agencia licenciada de cuidado en el hogar? Anúnciese en Pine Crane Care — contacte support@pinecranecare.com.",
    medicaidTeaser: "¿Podría calificar para Medicaid? Vea agencias licenciadas",
    partnersTitle: "Agencias Licenciadas y Medicaid",
    partnersSub: "¿Su ser querido podría calificar para cuidado en el hogar por Medicaid? Estas agencias licenciadas pueden ayudarle a verificar la elegibilidad, aplicar y recibir cuidado cubierto.",
    sponsoredTag: "Patrocinado", partnerCall: "Llamar", partnerSite: "Sitio web",
    postFeeTitle: "Tarifa por publicar solicitud",
    postFeeNote: "Pago único de $9.99 por publicación. Pago de demostración — este prototipo no cobra; la versión real usará la página segura de Stripe.",
    payPublish: "Pagar $9.99 y publicar",
    aideProLocked: "El contacto del cliente está disponible para miembros Aide Pro.",
    aideProBtn: "Hazte Aide Pro — $14.99/mes (demo)",
    tAidePro: "Aide Pro activo — contactos de clientes desbloqueados ✓",
    tUnlocked: "Cuidador desbloqueado ✓",
    plan_monthly: "Mensual", plan_quarterly: "3 meses", plan_annual: "Anual",
    blurb_monthly: "Acceso total, cancele cuando quiera.",
    blurb_quarterly: "Ahorre 17% — el más popular.",
    blurb_annual: "Mejor precio — ahorre 37%.",
    lServicesNeeded: "Servicios necesarios",
    grpSenior: "Cuidado de mayores", grpChild: "Niños y familia", grpHome: "Ayuda del hogar", grpExtended: "Cuidado extendido",
    reviews: "Reseñas", writeReview: "Escribir una reseña",
    commentPh: "¿Cómo fue el servicio? Puntualidad, calidad, comunicación…",
    submitReview: "Enviar reseña", noReviews: "Aún no hay reseñas.",
    errReview: "Seleccione una calificación e ingrese su nombre.",
    tReview: "Gracias — su reseña fue publicada ✓",
    faqTitle: "Preguntas Frecuentes", faqClientTitle: "Para Familias", faqAideTitle: "Para Cuidadores", faqLink: "Preguntas", whyMembership: "¿Por qué la membresía?",
    fPrivacy: "Política de privacidad", fTerms: "Términos de servicio", fBackup: "Copia de seguridad (pruebas)",
    fCopy: "© 2026 Pine Crane Care. Las familias son responsables de verificar y contratar.",
    tProfileLive: "Su perfil fue enviado para revisión — aparecerá en el directorio una vez verificado ✓",
    verifiedBadge: "✓ Verificado", tProfileUpd: "Perfil actualizado ✓", tProfileRem: "Perfil eliminado.",
    tJobLive: "¡Su solicitud está publicada! 🎉", tJobUpd: "Solicitud actualizada ✓", tJobRem: "Solicitud eliminada.",
    tMember: "Membresía activa — contactos desbloqueados ✓",
  },
};

const SERVICE_I18N = {
  "Personal care": { zh: "個人護理", es: "Cuidado personal" },
  "Meal preparation": { zh: "備餐", es: "Preparación de comidas" },
  "Medication reminders": { zh: "用藥提醒", es: "Recordatorio de medicamentos" },
  "Mobility assistance": { zh: "行動輔助", es: "Ayuda con movilidad" },
  "Companionship": { zh: "陪伴", es: "Compañía" },
  "Light housekeeping": { zh: "輕度家務", es: "Limpieza ligera" },
  "Transportation": { zh: "接送交通", es: "Transporte" },
  "Dementia care": { zh: "失智照護", es: "Cuidado de demencia" },
  "Child care": { zh: "兒童照護", es: "Cuidado infantil" },
  "Infant care": { zh: "嬰幼兒照護", es: "Cuidado de bebés" },
  "After-school care": { zh: "課後看顧", es: "Cuidado después de clases" },
  "Special needs care": { zh: "特殊需求照護", es: "Cuidado de necesidades especiales" },
  "Laundry": { zh: "洗衣", es: "Lavandería" },
  "Errands & shopping": { zh: "跑腿採買", es: "Mandados y compras" },
  "Pet care": { zh: "寵物照顧", es: "Cuidado de mascotas" },
  "Post-surgery care": { zh: "術後照護", es: "Cuidado postoperatorio" },
  "Overnight care": { zh: "夜間照護", es: "Cuidado nocturno" },
  "Live-in care": { zh: "住家看護", es: "Cuidado interno" },
  "Respite care": { zh: "喘息照護", es: "Cuidado de relevo" },
  "CPR / First Aid": { zh: "心肺復甦／急救", es: "RCP / Primeros auxilios" },
  "Dementia care training": { zh: "失智照護訓練", es: "Formación en demencia" },
};

let LANG_CURRENT = { lang: "en", L: STRINGS.en, ts: (s) => s };
function useLang() { return LANG_CURRENT; }


// ---------- Helpers ----------
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Downscale + compress the selfie so it fits comfortably in storage
function compressImage(file, maxSize = 420) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Supabase (permanent database) ----------
const APP_VERSION = "v2.5"; // ← bumped on every code update

const SUPABASE_URL = "https://vypbvydettsihtbelqhx.supabase.co";
const SUPABASE_KEY = "sb_publishable_tF0jsQrFs27d2RObzbH2WQ_k8AYRWF6";
const sbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

async function sbSelect(table, extra = "") {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc${extra}`, { headers: sbHeaders });
  if (!r.ok) throw new Error(`load ${table} failed: ${r.status}`);
  return r.json();
}
async function sbInsert(table, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`insert ${table} failed: ${r.status}`);
  return (await r.json())[0];
}
async function sbUpdate(table, id, row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...sbHeaders, Prefer: "return=representation" },
    body: JSON.stringify({ ...row, updated_at: new Date().toISOString() }),
  });
  if (!r.ok) throw new Error(`update ${table} failed: ${r.status}`);
  return (await r.json())[0];
}
async function sbDelete(table, id) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: sbHeaders,
  });
  if (!r.ok) throw new Error(`delete ${table} failed: ${r.status}`);
}
async function sbUploadPhoto(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob();
  const name = `p${Date.now()}${Math.random().toString(36).slice(2, 8)}.jpg`;
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/photos/${name}`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "image/jpeg" },
    body: blob,
  });
  if (!r.ok) throw new Error("photo upload failed");
  return `${SUPABASE_URL}/storage/v1/object/public/photos/${name}`;
}

// Map between app records and database rows
const numOrNull = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
const strOf = (v) => (v == null ? "" : String(v));

const aideToDb = (a) => ({
  name: a.name, phone: a.phone, email: a.email || null, city: a.city, zip: a.zip || null,
  age: numOrNull(a.age), years: numOrNull(a.years), rate: numOrNull(a.rate),
  languages: a.languages || null, bio: a.bio || null,
  services: a.services || [], certs: a.certs || [], photo_url: a.photo || null, cert_photo_url: a.certPhoto || null, pin: a.pin || null,
});
const aideFromDb = (r) => ({
  id: r.id, createdAt: new Date(r.created_at).getTime(),
  name: r.name || "", phone: r.phone || "", email: r.email || "", city: r.city || "", zip: r.zip || "",
  age: strOf(r.age), years: strOf(r.years), rate: strOf(r.rate),
  languages: r.languages || "", bio: r.bio || "",
  services: r.services || [], certs: r.certs || [], photo: r.photo_url || null, certPhoto: r.cert_photo_url || null, pin: r.pin || "", approved: !!r.approved, featured: !!r.featured,
});
const jobToDb = (j) => ({
  title: j.title, name: j.name, phone: j.phone, email: j.email || null, city: j.city, zip: j.zip || null,
  schedule: j.schedule || null, rate: numOrNull(j.rate),
  services: j.services || [], details: j.details || null, pin: j.pin || null,
});
const jobFromDb = (r) => ({
  id: r.id, createdAt: new Date(r.created_at).getTime(),
  title: r.title || "", name: r.name || "", phone: r.phone || "", email: r.email || "",
  city: r.city || "", zip: r.zip || "", schedule: r.schedule || "", rate: strOf(r.rate),
  services: r.services || [], details: r.details || "", pin: r.pin || "",
});

const loadAides = async () => (await sbSelect("caregivers", "&approved=eq.true")).map(aideFromDb).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
const loadJobs = async () => (await sbSelect("care_requests")).map(jobFromDb);
const loadReviews = async () => {
  try { return await sbSelect("reviews"); } catch (e) { return []; }
};
const loadAgencies = async () => {
  try {
    const rows = await sbSelect("agencies", "&active=eq.true");
    const today = new Date().toISOString().slice(0, 10);
    return rows.filter((a) => !a.paid_until || a.paid_until >= today);
  } catch (e) { return []; }
};


// ---------- Small UI pieces ----------
const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  fontSize: 16,
  border: `1.5px solid ${T.line}`,
  borderRadius: 10,
  background: "#FDFDFC",
  color: T.ink,
  outline: "none",
  fontFamily: "inherit",
};

function Field({ label, children, required }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
        {label} {required && <span style={{ color: T.danger }}>*</span>}
      </span>
      {children}
    </label>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: `1.5px solid ${active ? T.primary : T.line}`,
        background: active ? T.primary : "#fff",
        color: active ? "#fff" : T.ink,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

// ---------- Registration form ----------
function RegisterForm({ onSaved, onCancel, initial }) {
  const { L, ts } = useLang();
  const [form, setForm] = useState(
    initial || {
      name: "",
      phone: "",
      email: "",
      city: "",
      zip: "",
      age: "",
      years: "",
      rate: "",
      languages: "",
      bio: "",
      services: [],
      certs: [],
      photo: null,
      certPhoto: null,
      pin: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const fileRef = useRef(null);
  const certFileRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k, item) =>
    setForm((f) => ({
      ...f,
      [k]: f[k].includes(item) ? f[k].filter((x) => x !== item) : [...f[k], item],
    }));

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    try {
      const dataUrl = await compressImage(file);
      set("photo", dataUrl);
    } catch (err) {
      setError("Could not read that photo. Please try again.");
    }
    setPhotoBusy(false);
  }

  async function handleCertPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    setError("");
    try {
      const dataUrl = await compressImage(file, 900); // higher resolution so the license text stays readable
      set("certPhoto", dataUrl);
    } catch (err) {
      setError("Could not read that photo. Please try again.");
    }
    setPhotoBusy(false);
  }

  async function save() {
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError(L.errReq);
      return;
    }
    if (!form.photo) {
      setError(L.errPhoto);
      return;
    }
    if (!/^\d{4}$/.test(form.pin || "")) {
      setError(L.errPin);
      return;
    }
    setSaving(true);
    setError("");
    try {
      let photoUrl = form.photo;
      if (photoUrl && photoUrl.startsWith("data:")) {
        try { photoUrl = await sbUploadPhoto(photoUrl); } catch (e) { /* keep inline photo as fallback */ }
      }
      let certUrl = form.certPhoto;
      if (certUrl && certUrl.startsWith("data:")) {
        try { certUrl = await sbUploadPhoto(certUrl); } catch (e) { /* keep inline as fallback */ }
      }
      const row = aideToDb({ ...form, photo: photoUrl, certPhoto: certUrl });
      const saved = initial?.id
        ? await sbUpdate("caregivers", initial.id, row)
        : await sbInsert("caregivers", row);
      onSaved(aideFromDb(saved));
    } catch (e) {
      setError(L.errSave);
      setSaving(false);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {initial ? L.updTitle : L.regTitle}
      </h2>
      <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 15 }}>
        {initial ? L.updSub : L.regSub}
      </p>
      {initial && initial.approved === false && (
        <p style={{ margin: "-8px 0 16px", padding: "10px 12px", background: "#FCF4E3", border: `1px solid ${T.amber}`, borderRadius: 10, fontSize: 13.5, color: T.ink, lineHeight: 1.5 }}>
          {L.pendingEdit}
        </p>
      )}

      {/* Selfie */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <div
          style={{
            width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
            background: T.surface, border: `2px dashed ${form.photo ? T.primary : T.line}`,
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {form.photo ? (
            <img src={form.photo} alt="Your profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 34 }}>📷</span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={photoBusy}
            style={{
              padding: "10px 16px", borderRadius: 10, border: "none",
              background: T.primary, color: "#fff", fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {photoBusy ? L.processing : form.photo ? L.retake : L.selfie}
          </button>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: T.inkSoft }}>
            {L.cameraNote}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handlePhoto}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <Field label={L.lName} required>
        <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Maria Chen" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={L.lPhone} required>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-1234" />
        </Field>
        <Field label={L.lEmail}>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <Field label={L.lCity} required>
          <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Ashburn, VA" />
        </Field>
        <Field label={L.lZip}>
          <input style={inputStyle} inputMode="numeric" value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="20147" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label={L.lAge}>
          <input style={inputStyle} inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="45" />
        </Field>
        <Field label={L.lYrs}>
          <input style={inputStyle} inputMode="numeric" value={form.years} onChange={(e) => set("years", e.target.value)} placeholder="5" />
        </Field>
        <Field label={L.lRate}>
          <input style={inputStyle} inputMode="numeric" value={form.rate} onChange={(e) => set("rate", e.target.value)} placeholder="25" />
        </Field>
      </div>

      <Field label={L.lLang}>
        <input style={inputStyle} value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="English, Mandarin, Cantonese" />
      </Field>

      <Field label={L.lServices}>
        {SERVICE_GROUPS.map(([gk, items]) => (
          <div key={gk} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{L[gk]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((s) => (
                <Chip key={s} label={ts(s)} active={form.services.includes(s)} onClick={() => toggle("services", s)} />
              ))}
            </div>
          </div>
        ))}
      </Field>

      <Field label={L.lCerts}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CERTS.map((c) => (
            <Chip key={c} label={ts(c)} active={form.certs.includes(c)} onClick={() => toggle("certs", c)} />
          ))}
        </div>
      </Field>

      <Field label={L.lCertPhoto}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 110, height: 74, borderRadius: 10, flexShrink: 0, background: T.surface, border: `2px dashed ${form.certPhoto ? T.primary : T.line}`, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {form.certPhoto ? (
              <img src={form.certPhoto} alt="License" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: 26 }}>📄</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => certFileRef.current?.click()}
              disabled={photoBusy}
              style={{ padding: "9px 14px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff", color: T.primary, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
            >
              {form.certPhoto ? L.certRetake : L.certUpload}
            </button>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: T.inkSoft }}>{L.certPhotoNote}</p>
            <input ref={certFileRef} type="file" accept="image/*" capture="environment" onChange={handleCertPhoto} style={{ display: "none" }} />
          </div>
        </div>
      </Field>

      <Field label={L.lAbout}>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="A few sentences about your experience and approach to caregiving."
        />
      </Field>

      <Field label={L.lPin} required>
        <input
          style={{ ...inputStyle, maxWidth: 160, letterSpacing: 4 }}
          inputMode="numeric"
          maxLength={4}
          value={form.pin || ""}
          onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
        />
      </Field>

      {error && (
        <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: saving ? T.inkSoft : T.primary, color: "#fff",
            fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {saving ? L.saving : initial ? L.save : L.publish}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.ink, fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.cancel}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 12, marginBottom: 0 }}>
        {L.noteShared}
      </p>
    </div>
  );
}

// ---------- Directory ----------
function AideCard({ aide, onDelete, onEdit, subscribed, onRequireSub, reviews = [], onAddReview }) {
  const { L, ts } = useLang();
  const [revOpen, setRevOpen] = useState(false);
  const [revRating, setRevRating] = useState(0);
  const [revName, setRevName] = useState("");
  const [revComment, setRevComment] = useState("");
  const [revError, setRevError] = useState("");
  const [revBusy, setRevBusy] = useState(false);
  const avg = reviews.length ? (reviews.reduce((t, r) => t + r.rating, 0) / reviews.length).toFixed(1) : null;

  async function submitReview() {
    if (!revRating || !revName.trim()) { setRevError(L.errReview); return; }
    setRevBusy(true);
    setRevError("");
    try {
      await onAddReview(aide.id, { name: revName.trim(), rating: revRating, comment: revComment.trim() });
      setRevOpen(false); setRevRating(0); setRevComment("");
    } catch (e) {
      setRevError(L.errSave);
    }
    setRevBusy(false);
  }
  const [expanded, setExpanded] = useState(false);
  const [pinAction, setPinAction] = useState(null); // null | "edit" | "delete"
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");

  function requestAction(action) {
    // Older demo profiles created before PINs existed can be managed directly
    if (!aide.pin) {
      action === "edit" ? onEdit(aide) : onDelete(aide);
      return;
    }
    setPinAction(action);
    setPinValue("");
    setPinError("");
  }

  function confirmPin() {
    if (pinValue === aide.pin) {
      const action = pinAction;
      setPinAction(null);
      action === "edit" ? onEdit(aide) : onDelete(aide);
    } else {
      setPinError(L.pinBad);
    }
  }

  return (
    <div
      style={{
        background: T.card, borderRadius: 16, border: `1px solid ${T.line}`,
        padding: 16, marginBottom: 14,
      }}
    >
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ width: 68, height: 68, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: T.surface, border: `2px solid ${T.amber}` }}>
          {aide.photo ? (
            <img src={aide.photo} alt={aide.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🧑</div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: T.ink }}>
            {subscribed ? aide.name : L.teaserName}
            {aide.featured && <span style={{ color: "#3A2A08", background: T.amber, fontWeight: 800, fontSize: 11.5, marginLeft: 8, padding: "2px 8px", borderRadius: 999, verticalAlign: "middle" }}>{L.featuredBadge}</span>}
            <span style={{ color: "#fff", background: T.primary, fontWeight: 800, fontSize: 11.5, marginLeft: 8, padding: "2px 8px", borderRadius: 999, verticalAlign: "middle" }}>{L.verifiedBadge}</span>
            {avg && <span style={{ color: T.amber, fontWeight: 800, fontSize: 14.5, marginLeft: 8 }}>★ {avg} ({reviews.length})</span>}
          </div>
          <div style={{ fontSize: 14, color: T.inkSoft }}>
            {aide.city}{aide.age ? ` · ${L.ageLbl} ${aide.age}` : ""}{aide.years ? ` · ${aide.years} ${L.yrsExp}` : ""}{aide.rate ? ` · $${aide.rate}/hr` : ""}
          </div>
          {aide.languages && (
            <div style={{ fontSize: 13.5, color: T.primary, fontWeight: 600 }}>{L.speaks} {aide.languages}</div>
          )}
        </div>
      </div>

      {aide.services?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
          {aide.services.slice(0, expanded ? undefined : 4).map((s) => (
            <span key={s} style={{ fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: T.surface, color: T.ink, border: `1px solid ${T.line}` }}>
              {ts(s)}
            </span>
          ))}
          {!expanded && aide.services.length > 4 && (
            <span style={{ fontSize: 12.5, color: T.inkSoft, padding: "4px 4px" }}>+{aide.services.length - 4} more</span>
          )}
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 12, fontSize: 14.5, color: T.ink }}>
          {aide.certs?.length > 0 && (
            <p style={{ margin: "0 0 8px" }}>
              <strong>{L.certified}</strong> {aide.certs.map(ts).join(", ")}
            </p>
          )}
          {aide.bio && <p style={{ margin: "0 0 8px", color: T.inkSoft }}>{aide.bio}</p>}
          {subscribed ? (
            <p style={{ margin: 0 }}>
              <strong>{L.contactLbl}</strong>{" "}
              <a href={"tel:" + aide.phone} style={{ color: T.primary, fontWeight: 700 }}>{aide.phone}</a>
              {aide.email ? <> · <a href={"mailto:" + aide.email} style={{ color: T.primary }}>{aide.email}</a></> : null}
            </p>
          ) : (
            <div style={{ padding: 12, background: T.surface, borderRadius: 10, border: `1px dashed ${T.line}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: T.ink }}>
                🔒 {L.lockedLine}
              </p>
              <button
                type="button"
                onClick={onRequireSub}
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "none", background: T.amber,
                  color: "#3A2A08", fontWeight: 800, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.unlock}
              </button>
            </div>
          )}

          {/* Reviews */}
          <div style={{ marginTop: 14, borderTop: `1px solid ${T.line}`, paddingTop: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: T.ink, marginBottom: 8 }}>
              {L.reviews}{avg && <span style={{ color: T.amber, marginLeft: 8 }}>★ {avg} · {reviews.length}</span>}
            </div>
            {reviews.length === 0 && (
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: T.inkSoft }}>{L.noReviews}</p>
            )}
            {reviews.map((r) => (
              <div key={r.id} style={{ padding: "10px 12px", background: T.surface, borderRadius: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 13.5 }}>
                  <span style={{ color: T.amber, letterSpacing: 1 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  {"  "}<strong style={{ color: T.ink }}>{r.reviewer_name}</strong>
                  {"  "}<span style={{ color: T.inkSoft, fontSize: 12.5 }}>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p style={{ margin: "6px 0 0", fontSize: 14, color: T.ink, lineHeight: 1.45 }}>{r.comment}</p>}
              </div>
            ))}
            {revOpen && subscribed ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => { setRevRating(n); setRevError(""); }}
                      style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: n <= revRating ? T.amber : T.line, padding: "0 2px" }}>
                      ★
                    </button>
                  ))}
                </div>
                <input style={{ ...inputStyle, marginBottom: 8 }} placeholder={L.lYourName} value={revName} onChange={(e) => setRevName(e.target.value)} />
                <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: 8 }} placeholder={L.commentPh} value={revComment} onChange={(e) => setRevComment(e.target.value)} />
                {revError && <p style={{ color: T.danger, fontSize: 13.5, fontWeight: 600, margin: "0 0 8px" }}>{revError}</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" disabled={revBusy} onClick={submitReview}
                    style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}>
                    {revBusy ? L.saving : L.submitReview}
                  </button>
                  <button type="button" onClick={() => setRevOpen(false)}
                    style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    {L.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => (subscribed ? setRevOpen(true) : onRequireSub())}
                style={{ marginTop: 4, padding: "10px 16px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                {subscribed ? L.writeReview : "🔒 " + L.writeReview}
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => (subscribed ? setExpanded(!expanded) : onRequireSub())}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${T.primary}`,
            background: expanded ? T.primary : "#fff", color: expanded ? "#fff" : T.primary,
            fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {subscribed ? (expanded ? L.showLess : L.viewProfile) : "🔒 " + L.viewProfile}
        </button>
        <button
          type="button"
          onClick={() => requestAction("edit")}
          title="Edit profile (owner only)"
          style={{
            padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.editBtn}
        </button>
        <button
          type="button"
          onClick={() => requestAction("delete")}
          title="Remove profile (owner only)"
          style={{
            padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ✕
        </button>
      </div>

      {pinAction && (
        <div style={{ marginTop: 10, padding: 12, background: T.surface, borderRadius: 10, border: `1px solid ${T.line}` }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
            {L.pinPrompt}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, maxWidth: 120, letterSpacing: 4, padding: "9px 12px" }}
              inputMode="numeric"
              maxLength={4}
              value={pinValue}
              onChange={(e) => { setPinValue(e.target.value.replace(/\D/g, "")); setPinError(""); }}
              placeholder="••••"
            />
            <button
              type="button"
              onClick={confirmPin}
              style={{
                padding: "9px 16px", borderRadius: 10, border: "none", background: T.primary,
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {L.confirm}
            </button>
            <button
              type="button"
              onClick={() => setPinAction(null)}
              style={{
                padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff",
                color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {L.cancel}
            </button>
          </div>
          {pinError && <p style={{ color: T.danger, fontSize: 13, fontWeight: 600, margin: "8px 0 0" }}>{pinError}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Hero banner photos ----------
// Paste licensed photo URLs here (e.g. from pexels.com — free for commercial use).
// When empty, the banner shows the brand illustration instead.
const HERO_PHOTOS = [
  // Free Pexels photos (Pexels license: free for commercial use, no attribution required)
  // Aide assisting an elderly woman with a walker:
  "https://images.pexels.com/photos/34328480/pexels-photo-34328480.jpeg?auto=compress&cs=tinysrgb&h=400",
  // Aide with a senior adult in a wheelchair:
  "https://images.pexels.com/photos/16364306/pexels-photo-16364306.jpeg?auto=compress&cs=tinysrgb&h=400",
  // Caregiver with an infant (chosen by Jason — Pexels, free license):
  "https://images.pexels.com/photos/23174628/pexels-photo-23174628.jpeg?auto=compress&cs=tinysrgb&h=400",
];

function HeroVisual() {
  const [failed, setFailed] = useState({});
  const photos = HERO_PHOTOS.filter((_, i) => !failed[i]);
  if (photos.length === 0) return <HeroIllustration />;
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {HERO_PHOTOS.slice(0, 3).map((url, i) =>
        failed[i] ? null : (
          <img
            key={url}
            src={url}
            alt="A home aide caring for a senior"
            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
            style={{
              flex: 1, minWidth: 0, height: 150, objectFit: "cover",
              borderRadius: 10, display: "block",
            }}
          />
        )
      )}
    </div>
  );
}

// ---------- Hero illustration ----------
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 640 210"
      role="img"
      aria-label="Home aides assisting seniors and people with disabilities in daily life"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      {/* ground */}
      <ellipse cx="320" cy="216" rx="330" ry="44" fill="#E4EDE6" />
      {/* sun */}
      <circle cx="596" cy="38" r="18" fill="#E8A83E" opacity="0.85" />
      {/* pine tree */}
      <rect x="52" y="128" width="10" height="44" rx="3" fill="#7A5A3A" />
      <polygon points="57,40 92,102 22,102" fill="#2E6E5E" />
      <polygon points="57,68 98,134 16,134" fill="#3B8271" />
      {/* red-crowned crane flying */}
      <g>
        <ellipse cx="178" cy="60" rx="16" ry="8" fill="#FFFFFF" stroke="#B9CEC6" strokeWidth="1.5" />
        <path d="M186 55 q6 -24 32 -28 q-10 16 -16 30 z" fill="#22403A" />
        <path d="M168 58 C158 48 150 44 142 47" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="141" cy="46" r="5" fill="#FFFFFF" stroke="#B9CEC6" strokeWidth="1.2" />
        <circle cx="140" cy="42.5" r="1.8" fill="#C0392B" />
        <path d="M136 46 l-11 3 l11 2 z" fill="#E8A83E" />
        <line x1="192" y1="64" x2="212" y2="72" stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* heart */}
      <path d="M356 46 c4 -8 16 -6 16 3 c0 7 -9 12 -16 17 c-7 -5 -16 -10 -16 -17 c0 -9 12 -11 16 -3 z" fill="#E8A83E" opacity="0.9" />

      {/* scene 1: aide steadying an elder who walks with a cane */}
      <g>
        {/* elder */}
        <circle cx="268" cy="84" r="13" fill="#E8B48A" />
        <path d="M255 82 a13 13 0 0 1 26 -3 l-5 -7 q-9 -7 -17 1 z" fill="#DCDCDC" />
        <path d="M252 152 q-2 -46 16 -52 q16 -4 20 10 q6 26 2 42 z" fill="#B9A7C9" />
        <line x1="246" y1="120" x2="240" y2="176" stroke="#8A6B4A" strokeWidth="4" strokeLinecap="round" />
        <circle cx="247" cy="117" r="4.5" fill="#E8B48A" />
        <rect x="258" y="148" width="8" height="28" rx="4" fill="#6E6E7E" />
        <rect x="272" y="148" width="8" height="28" rx="4" fill="#6E6E7E" />
        {/* aide in scrubs, arm around elder's back */}
        <circle cx="308" cy="68" r="13" fill="#C68863" />
        <path d="M295 64 a13 13 0 0 1 26 0 l0 -6 q-13 -10 -26 0 z" fill="#2B2B2B" />
        <path d="M295 150 q-4 -50 13 -56 q17 -6 21 8 q8 30 4 48 z" fill="#2E6E5E" />
        <path d="M299 100 q-18 6 -27 16" stroke="#2E6E5E" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="271" cy="118" r="4.5" fill="#C68863" />
        <rect x="299" y="146" width="9" height="30" rx="4" fill="#22403A" />
        <rect x="313" y="146" width="9" height="30" rx="4" fill="#22403A" />
      </g>

      {/* scene 2: aide assisting a senior in a wheelchair */}
      <g>
        {/* aide pushing */}
        <circle cx="438" cy="70" r="13" fill="#8A5A3A" />
        <path d="M425 66 a13 13 0 0 1 26 0 l0 -6 q-13 -10 -26 0 z" fill="#1E1E1E" />
        <path d="M426 150 q-6 -52 12 -58 q16 -5 20 9 q7 28 3 49 z" fill="#3B8271" />
        <path d="M446 96 q14 6 21 12" stroke="#3B8271" strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="469" cy="110" r="4.5" fill="#8A5A3A" />
        <rect x="430" y="146" width="9" height="32" rx="4" fill="#22403A" />
        <rect x="444" y="146" width="9" height="32" rx="4" fill="#22403A" />
        {/* wheelchair frame */}
        <path d="M470 130 l0 -24 l-6 -3" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M470 130 l42 0 q9 0 11 9 l5 21" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="488" cy="156" r="26" fill="none" stroke="#3A3A3A" strokeWidth="5" />
        <circle cx="488" cy="156" r="4" fill="#3A3A3A" />
        <line x1="488" y1="156" x2="488" y2="134" stroke="#3A3A3A" strokeWidth="2.5" />
        <line x1="488" y1="156" x2="506" y2="146" stroke="#3A3A3A" strokeWidth="2.5" />
        <line x1="488" y1="156" x2="470" y2="144" stroke="#3A3A3A" strokeWidth="2.5" />
        <circle cx="527" cy="172" r="9" fill="none" stroke="#3A3A3A" strokeWidth="4" />
        {/* senior seated */}
        <circle cx="494" cy="92" r="12" fill="#E8B48A" />
        <path d="M482 88 a12 12 0 0 1 24 0 l0 -5 q-12 -9 -24 0 z" fill="#EDEDED" />
        <path d="M480 136 q0 -32 14 -34 q14 -2 16 12 l2 22 z" fill="#D98E5A" />
        <path d="M482 130 q22 -4 28 6 l4 16 q-2 6 -8 4 l-5 -14 q-10 -4 -19 -2 z" fill="#6E6E7E" />
      </g>
    </svg>
  );
}

// ---------- Care requests (client job postings) ----------
function JobForm({ onSaved, onCancel, initial }) {
  const { L, ts } = useLang();
  const [payStep, setPayStep] = useState(false);
  const [form, setForm] = useState(
    initial || {
      title: "", name: "", phone: "", email: "", city: "", zip: "",
      schedule: "", rate: "", services: [], details: "", pin: "",
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (item) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(item) ? f.services.filter((x) => x !== item) : [...f.services, item],
    }));

  async function save() {
    if (!form.title.trim() || !form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      setError(L.errJobReq);
      return;
    }
    if (!/^\d{4}$/.test(form.pin || "")) {
      setError(L.errPin);
      return;
    }
    if (!initial && !payStep) {
      setPayStep(true);
      setError("");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const row = jobToDb(form);
      const saved = initial?.id
        ? await sbUpdate("care_requests", initial.id, row)
        : await sbInsert("care_requests", row);
      onSaved(jobFromDb(saved));
    } catch (e) {
      setError(L.errSave);
      setSaving(false);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {initial ? L.jfUpd : L.jfTitle}
      </h2>
      <p style={{ margin: "0 0 20px", color: T.inkSoft, fontSize: 15 }}>
        {L.jfSub}
      </p>

      <Field label={L.lTitle} required>
        <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Weekday morning help for my mother" />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={L.lYourName} required>
          <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="First name is fine" />
        </Field>
        <Field label={L.lPhone} required>
          <input style={inputStyle} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-1234" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Field label={L.lEmail}>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Optional" />
        </Field>
        <Field label={L.lCity} required>
          <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Flushing, NY" />
        </Field>
        <Field label={L.lZip}>
          <input style={inputStyle} inputMode="numeric" value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="11354" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <Field label={L.lSchedule}>
          <input style={inputStyle} value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="e.g. Mon–Fri, 8am–12pm" />
        </Field>
        <Field label={L.lOffered}>
          <input style={inputStyle} inputMode="numeric" value={form.rate} onChange={(e) => set("rate", e.target.value)} placeholder="25" />
        </Field>
      </div>

      <Field label={L.lServicesNeeded}>
        {SERVICE_GROUPS.map(([gk, items]) => (
          <div key={gk} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.inkSoft, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{L[gk]}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((s) => (
                <Chip key={s} label={ts(s)} active={form.services.includes(s)} onClick={() => toggle(s)} />
              ))}
            </div>
          </div>
        ))}
      </Field>

      <Field label={L.lDetails}>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
          value={form.details}
          onChange={(e) => set("details", e.target.value)}
          placeholder={L.detailsPh}
        />
      </Field>

      <Field label={L.lPinJob} required>
        <input
          style={{ ...inputStyle, maxWidth: 160, letterSpacing: 4 }}
          inputMode="numeric"
          maxLength={4}
          value={form.pin || ""}
          onChange={(e) => set("pin", e.target.value.replace(/\D/g, ""))}
          placeholder="••••"
        />
      </Field>

      {payStep && !initial && (
        <div style={{ border: `2px solid ${T.amber}`, borderRadius: 14, padding: 14, marginBottom: 14, background: "#FFFDF7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 15.5, fontWeight: 800, color: T.ink }}>{L.postFeeTitle}</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>$9.99</span>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.postFeeNote}</p>
        </div>
      )}
      {error && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{error}</p>}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            flex: 1, padding: "14px", borderRadius: 12, border: "none",
            background: saving ? T.inkSoft : T.primary, color: "#fff",
            fontSize: 17, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {saving ? L.saving : initial ? L.save : payStep ? L.payPublish : L.publishJob}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`,
            background: "#fff", color: T.ink, fontSize: 16, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {L.cancel}
        </button>
      </div>
      <p style={{ fontSize: 12.5, color: T.inkSoft, marginTop: 12, marginBottom: 0 }}>
        {L.jobShared}
      </p>
    </div>
  );
}

function JobCard({ job, onDelete, onEdit, aidePro, onAideProSignup }) {
  const { L, ts } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [pinAction, setPinAction] = useState(null);
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState("");

  function requestAction(action) {
    if (!job.pin) {
      action === "edit" ? onEdit(job) : onDelete(job);
      return;
    }
    setPinAction(action);
    setPinValue("");
    setPinError("");
  }
  function confirmPin() {
    if (pinValue === job.pin) {
      const action = pinAction;
      setPinAction(null);
      action === "edit" ? onEdit(job) : onDelete(job);
    } else {
      setPinError(L.pinBad);
    }
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.line}`, padding: 16, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: T.ink }}>{job.title}</div>
        {job.rate && <div style={{ fontWeight: 800, color: T.primary, whiteSpace: "nowrap" }}>${job.rate}/hr</div>}
      </div>
      <div style={{ fontSize: 14, color: T.inkSoft, marginTop: 2 }}>
        {job.city}{job.schedule ? ` · ${job.schedule}` : ""} · {L.postedOn} {new Date(job.createdAt).toLocaleDateString()}
      </div>
      {job.services?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {job.services.map((s) => (
            <span key={s} style={{ fontSize: 12.5, fontWeight: 600, padding: "4px 10px", borderRadius: 999, background: T.surface, color: T.ink, border: `1px solid ${T.line}` }}>
              {ts(s)}
            </span>
          ))}
        </div>
      )}
      {expanded && (
        <div style={{ marginTop: 12, fontSize: 14.5, color: T.ink }}>
          {job.details && <p style={{ margin: "0 0 8px", color: T.inkSoft }}>{job.details}</p>}
          {aidePro ? (
            <p style={{ margin: 0 }}>
              <strong>{L.contactPerson} {job.name}:</strong>{" "}
              <a href={"tel:" + job.phone} style={{ color: T.primary, fontWeight: 700 }}>{job.phone}</a>
              {job.email ? <> · <a href={"mailto:" + job.email} style={{ color: T.primary }}>{job.email}</a></> : null}
            </p>
          ) : (
            <div style={{ padding: 12, background: T.surface, borderRadius: 10, border: `1px dashed ${T.line}` }}>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: T.ink }}>
                🔒 <strong>{L.contactPerson} {job.name}: (•••) •••-••••</strong> — {L.aideProLocked}
              </p>
              <button
                type="button"
                onClick={onAideProSignup}
                style={{
                  padding: "10px 16px", borderRadius: 10, border: "none", background: T.primary,
                  color: "#fff", fontWeight: 800, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.aideProBtn}
              </button>
            </div>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${T.primary}`,
            background: expanded ? T.primary : "#fff", color: expanded ? "#fff" : T.primary,
            fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {expanded ? L.showLess : L.viewDetails}
        </button>
        <button type="button" onClick={() => requestAction("edit")} title="Edit post (owner only)"
          style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          {L.editBtn}
        </button>
        <button type="button" onClick={() => requestAction("delete")} title="Remove post (owner only)"
          style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
          ✕
        </button>
      </div>
      {pinAction && (
        <div style={{ marginTop: 10, padding: 12, background: T.surface, borderRadius: 10, border: `1px solid ${T.line}` }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
            {L.pinPrompt}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...inputStyle, maxWidth: 120, letterSpacing: 4, padding: "9px 12px" }}
              inputMode="numeric" maxLength={4} value={pinValue}
              onChange={(e) => { setPinValue(e.target.value.replace(/\D/g, "")); setPinError(""); }}
              placeholder="••••"
            />
            <button type="button" onClick={confirmPin}
              style={{ padding: "9px 16px", borderRadius: 10, border: "none", background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {L.confirm}
            </button>
            <button type="button" onClick={() => setPinAction(null)}
              style={{ padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft, fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              {L.cancel}
            </button>
          </div>
          {pinError && <p style={{ color: T.danger, fontSize: 13, fontWeight: 600, margin: "8px 0 0" }}>{pinError}</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Subscription plans ----------
const PLANS = [
  { id: "monthly", name: "Monthly", price: "$19.99", per: "/month", months: 1, blurb: "Full access, cancel anytime." },
  { id: "quarterly", name: "3 Months", price: "$49.99", per: "/3 months", months: 3, blurb: "Save 17% — most popular.", featured: true },
  { id: "annual", name: "Annual", price: "$149.99", per: "/year", months: 12, blurb: "Best value — save 37%." },
];

function PlansView({ onActivate, onBack, singleUnlock, onSingleUnlock }) {
  const { L } = useLang();
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.plTitle}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 15, color: T.inkSoft, lineHeight: 1.5 }}>
        {L.plSub}
      </p>

      <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.line}`, padding: "12px 16px", marginBottom: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 6 }}>{L.benefitsTitle}</div>
        {[L.benefit1, L.benefit2, L.benefit3, L.benefit4].map((b) => (
          <div key={b} style={{ fontSize: 14, color: T.inkSoft, marginBottom: 4 }}>✓ {b}</div>
        ))}
      </div>

      {singleUnlock && (
        <div style={{ border: `2px solid ${T.amber}`, borderRadius: 14, padding: 16, marginBottom: 14, background: "#FFFDF7" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>{L.suName}</span>
            <span>
              <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>{L.suPrice}</span>
              <span style={{ fontSize: 13, color: T.inkSoft }}>{L.suPer}</span>
            </span>
          </div>
          <div style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4, marginBottom: 10 }}>{L.suBlurb}</div>
          <button
            type="button"
            onClick={onSingleUnlock}
            style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: T.amber, color: "#3A2A08", fontWeight: 800, fontSize: 15.5, cursor: "pointer", fontFamily: "inherit" }}
          >
            {L.suName} ✓
          </button>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            style={{
              textAlign: "left", padding: "16px", borderRadius: 14, cursor: "pointer", fontFamily: "inherit",
              border: `2px solid ${selected?.id === p.id ? T.primary : p.featured ? T.amber : T.line}`,
              background: selected?.id === p.id ? "#EFF6F3" : "#fff",
              position: "relative",
            }}
          >
            {p.featured && (
              <span style={{ position: "absolute", top: -10, right: 14, background: T.amber, color: "#3A2A08", fontSize: 11.5, fontWeight: 800, padding: "3px 10px", borderRadius: 999 }}>
                {L.popular}
              </span>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: T.ink }}>{L["plan_" + p.id]}</span>
              <span>
                <span style={{ fontSize: 20, fontWeight: 800, color: T.primary }}>{p.price}</span>
                <span style={{ fontSize: 13, color: T.inkSoft }}>{p.per}</span>
              </span>
            </div>
            <div style={{ fontSize: 13.5, color: T.inkSoft, marginTop: 4 }}>{L["blurb_" + p.id]}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: 18, padding: 16, background: T.surface, borderRadius: 14, border: `1px solid ${T.line}` }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink, marginBottom: 4 }}>
            {L["plan_" + selected.id]} — {selected.price}{selected.per}
          </div>
          <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>
            {L.demoText}
          </p>
          <button
            type="button"
            onClick={() => onActivate(selected)}
            style={{
              width: "100%", padding: "14px", borderRadius: 12, border: "none",
              background: T.primary, color: "#fff", fontSize: 16.5, fontWeight: 800,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {L.activate}
          </button>
        </div>
      )}
    </div>
  );
}


// ---------- FAQ content (EN / 中文 / Español) ----------
const FAQ = {
  en: {
    client: [
      ["Is browsing free?", "Yes. Anyone can search and browse every verified caregiver profile for free. A membership unlocks full profiles and direct contact information (phone and email) for every caregiver on the platform."],
      ["Why keep my membership after I've hired someone?", "Because care needs change. Active members get replacement matching at no extra charge if your caregiver becomes unavailable — illness, schedule changes, or moving on. You can also post urgent backup requests and contact unlimited caregivers as needs evolve, whether that's more hours, respite relief, or recovery care after a hospital stay. Your membership is your safety net, not just a one-time search."],
      ["Are caregivers verified?", "Every caregiver listed has been reviewed by Pine Crane Care before appearing in the directory — that's what the ✓ Verified badge means. We still encourage families to interview candidates and check references; our platform gives you the tools and reviews to do it well."],
      ["Who sets the pay rate?", "You and the caregiver agree on the rate directly. There is no agency markup in the middle — caregivers typically earn more than agency wages while families often pay less than agency billing rates."],
      ["I live out of state or overseas — can I arrange care for my parents?", "Absolutely — this is one of the things Pine Crane Care was built for. Search by the ZIP code where your loved one lives, review verified profiles in English, 中文, or Español, and contact caregivers from anywhere in the world."],
      ["What if the caregiver doesn't work out?", "With an active membership, just come back — contact new caregivers or post a care request at no additional charge. Members never start from zero. This ongoing protection is the biggest reason families keep their membership active."],
    ],
    aide: [
      ["Does it cost money to join as a caregiver?", "No. Creating your profile is free, and it stays free to be listed once verified."],
      ["How do I get clients?", "Two ways: families searching your area find your verified profile, and you can browse the Care Requests board and contact families directly about the jobs they've posted."],
      ["Why keep my profile active after I find work?", "Because every job ends eventually — schedules change, families relocate, care needs shift. An active profile with good reviews means your next client finds you before your current job ends, so you avoid gaps in income. Think of your profile as your ongoing storefront, not a one-time ad."],
      ["How do reviews help me earn more?", "Caregivers with strong reviews get contacted first and can confidently ask for higher rates. Every family you serve well builds a reputation that lives permanently on your profile — it's the most valuable asset you build here."],
      ["Do I keep all my earnings?", "Yes. Families pay you directly at the rate you agreed. Pine Crane Care never takes a cut of your hourly pay."],
      ["What does the Verified badge mean for me?", "Verification tells families your identity and stated credentials have been reviewed — verified caregivers get significantly more contact from families. Keep your certifications up to date on your profile to make the most of it."],
    ],
  },
  zh: {
    client: [
      ["瀏覽是免費的嗎？", "是的。任何人都可以免費搜尋及瀏覽所有經驗證的照護者檔案。成為會員後，即可解鎖完整檔案與每位照護者的直接聯絡方式（電話與電子郵件）。"],
      ["已經請到人了，為什麼還要續會員？", "因為照護需求會變化。會員在照護者因生病、時間衝突或離職而無法繼續時，可免費重新配對。您也可以發布緊急替補需求，並隨需求變化（增加時數、喘息照護、術後照護）聯繫任何照護者。會員資格是您的安全網，不只是一次性的搜尋。"],
      ["照護者有經過驗證嗎？", "名錄中的每位照護者都經過松鶴護理審核後才會顯示 — 這就是 ✓ 已驗證標章的意義。我們仍建議家庭親自面談並查核推薦人；平台提供評價與工具協助您做好把關。"],
      ["時薪由誰決定？", "由您與照護者直接商定，中間沒有仲介抽成 — 照護者通常比仲介工資賺得多，而家庭往往比仲介收費付得少。"],
      ["我住在外州或海外，可以為父母安排照護嗎？", "當然可以 — 這正是松鶴護理的核心服務之一。輸入家人居住地的郵遞區號搜尋，以中文、英文或西班牙文瀏覽經驗證的檔案，從世界任何地方聯繫照護者。"],
      ["如果照護者不合適怎麼辦？", "只要會員資格有效，隨時回來即可 — 免費聯繫新的照護者或發布徵求。會員永遠不必從零開始，這份持續保障正是家庭續會的最大原因。"],
    ],
    aide: [
      ["註冊成為照護者要收費嗎？", "不用。建立檔案完全免費，通過驗證後刊登也免費。"],
      ["我要怎麼找到客戶？", "兩個管道：您所在地區的家庭搜尋時會看到您的驗證檔案；您也可以瀏覽「徵求看護」版面，直接聯繫發布需求的家庭。"],
      ["找到工作後，為什麼還要保持檔案有效？", "因為每份工作終會結束 — 時間表變動、家庭搬遷、照護需求改變。保持檔案活躍並累積好評，下一位客戶會在目前工作結束前找到您，避免收入中斷。把檔案當作您長期經營的店面，而不是一次性的廣告。"],
      ["評價如何幫助我賺更多？", "評價優良的照護者會最先被聯繫，也能有底氣開出較高時薪。每服務好一個家庭，都會在您的檔案上累積永久的口碑 — 這是您在平台上最有價值的資產。"],
      ["我的收入需要被抽成嗎？", "不需要。家庭依雙方議定的時薪直接付款給您，松鶴護理不從您的時薪中抽取任何費用。"],
      ["「已驗證」標章對我有什麼意義？", "驗證代表您的身分與所列資格已經過審核 — 通過驗證的照護者獲得家庭聯繫的機會顯著更多。請保持檔案上的證照資訊最新，發揮最大效益。"],
    ],
  },
  es: {
    client: [
      ["¿Navegar es gratis?", "Sí. Cualquiera puede buscar y ver todos los perfiles verificados gratis. La membresía desbloquea los perfiles completos y la información de contacto directa (teléfono y correo) de cada cuidador."],
      ["¿Por qué mantener mi membresía después de contratar?", "Porque las necesidades de cuidado cambian. Los miembros activos obtienen un nuevo emparejamiento sin costo adicional si su cuidador deja de estar disponible. También puede publicar solicitudes urgentes de reemplazo y contactar cuidadores ilimitados a medida que cambian las necesidades. Su membresía es su red de seguridad, no solo una búsqueda única."],
      ["¿Los cuidadores están verificados?", "Cada cuidador listado fue revisado por Pine Crane Care antes de aparecer — eso significa la insignia ✓ Verificado. Aun así recomendamos entrevistar y pedir referencias; la plataforma le da las herramientas y reseñas para hacerlo bien."],
      ["¿Quién establece la tarifa?", "Usted y el cuidador la acuerdan directamente. No hay margen de agencia — los cuidadores suelen ganar más y las familias suelen pagar menos que con una agencia."],
      ["Vivo en otro estado o país — ¿puedo organizar el cuidado de mis padres?", "Por supuesto — la plataforma fue creada para eso. Busque por el código postal donde vive su ser querido, revise perfiles verificados en español, inglés o chino, y contacte cuidadores desde cualquier parte del mundo."],
      ["¿Y si el cuidador no funciona?", "Con membresía activa, simplemente regrese — contacte nuevos cuidadores o publique una solicitud sin cargo adicional. Los miembros nunca empiezan de cero. Esta protección continua es la mayor razón para mantener la membresía."],
    ],
    aide: [
      ["¿Cuesta dinero registrarse como cuidador?", "No. Crear su perfil es gratis, y estar listado tras la verificación también."],
      ["¿Cómo consigo clientes?", "De dos formas: las familias de su zona encuentran su perfil verificado al buscar, y usted puede revisar las Solicitudes y contactar directamente a las familias."],
      ["¿Por qué mantener mi perfil activo después de encontrar trabajo?", "Porque todo trabajo termina — cambian los horarios, las familias se mudan, las necesidades evolucionan. Un perfil activo con buenas reseñas significa que su próximo cliente lo encuentra antes de que termine el actual, evitando periodos sin ingresos."],
      ["¿Cómo me ayudan las reseñas a ganar más?", "Los cuidadores con buenas reseñas son contactados primero y pueden pedir tarifas más altas. Cada familia bien atendida construye una reputación permanente en su perfil — su activo más valioso aquí."],
      ["¿Me quedo con todo lo que gano?", "Sí. Las familias le pagan directamente la tarifa acordada. Pine Crane Care nunca toma un porcentaje de su pago por hora."],
      ["¿Qué significa la insignia Verificado para mí?", "La verificación indica que su identidad y credenciales fueron revisadas — los cuidadores verificados reciben mucho más contacto de las familias. Mantenga sus certificaciones al día para aprovecharla al máximo."],
    ],
  },
};

function FaqView({ onBack }) {
  const { lang, L } = useLang();
  const faq = FAQ[lang] || FAQ.en;
  const section = (title, items) => (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 19, color: T.primary, fontFamily: "Georgia, 'Times New Roman', serif" }}>{title}</h3>
      {items.map(([q, a]) => (
        <details key={q} style={{ background: T.surface, borderRadius: 12, border: `1px solid ${T.line}`, padding: "12px 14px", marginBottom: 8 }}>
          <summary style={{ fontWeight: 700, fontSize: 15, color: T.ink, cursor: "pointer" }}>{q}</summary>
          <p style={{ margin: "10px 0 0", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.6 }}>{a}</p>
        </details>
      ))}
    </div>
  );
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 16px", fontSize: 26, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.faqTitle}
      </h2>
      {section(L.faqClientTitle, faq.client)}
      {section(L.faqAideTitle, faq.aide)}
    </div>
  );
}

// ---------- Aide self-service profile access ----------
function AideLoginView({ onFound, onBack }) {
  const { L } = useLang();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    setErr("");
    try {
      const digits = (v) => (v || "").replace(/\D/g, "");
      if (!digits(phone) || !/^\d{4}$/.test(pin)) {
        setErr(L.aideLoginErr);
        setBusy(false);
        return;
      }
      const all = await sbSelect("caregivers");
      const rec = all.find((r) => digits(r.phone) === digits(phone) && r.pin === pin);
      if (rec) onFound(aideFromDb({ ...rec }));
      else setErr(L.aideLoginErr);
    } catch (e) {
      setErr(L.errSave);
    }
    setBusy(false);
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 420 }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {L.aideLoginTitle}
      </h2>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.aideLoginSub}</p>
      <Field label={L.lPhone} required>
        <input style={inputStyle} type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setErr(""); }} placeholder="(555) 555-1234" />
      </Field>
      <Field label="PIN" required>
        <input
          style={{ ...inputStyle, maxWidth: 140, letterSpacing: 4 }}
          inputMode="numeric" maxLength={4} value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setErr(""); }}
          placeholder="••••"
        />
      </Field>
      {err && <p style={{ color: T.danger, fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>{err}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={go}
          disabled={busy}
          style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: busy ? T.inkSoft : T.primary, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
        >
          {busy ? L.saving : L.aideLoginBtn}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "13px 18px", borderRadius: 12, border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
        >
          {L.cancel}
        </button>
      </div>
    </div>
  );
}

// ---------- Admin panel (platform operator only) ----------
const ADMIN_PIN = "8888"; // ← CHANGE THIS to your own passcode before deploying

function AdminView({ onBack, onDataChanged }) {
  const [ok, setOk] = useState(false);
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [tab, setTab] = useState("caregivers");
  const [rows, setRows] = useState([]);
  const [ags, setAgs] = useState([]);
  const [msg, setMsg] = useState("");
  const [agForm, setAgForm] = useState({ name: "", phone: "", website: "", areas: "", blurb: "", contact_name: "", email: "", monthly_fee: "", paid_until: "" });
  const [agEditId, setAgEditId] = useState(null);
  const blankAgForm = { name: "", phone: "", website: "", areas: "", blurb: "", contact_name: "", email: "", monthly_fee: "", paid_until: "" };

  async function refresh() {
    setMsg("");
    try {
      const all = await sbSelect("caregivers");
      all.sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1));
      setRows(all);
    } catch (e) { setMsg("Could not load caregivers."); }
    try { setAgs(await sbSelect("agencies")); } catch (e) { /* table may be empty */ }
  }
  useEffect(() => { if (ok) refresh(); }, [ok]);

  async function patch(table, id, fields) {
    try { await sbUpdate(table, id, fields); await refresh(); onDataChanged(); }
    catch (e) { setMsg("Update failed — check the agencies policies SQL was run."); }
  }
  async function remove(table, id, label) {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    try { await sbDelete(table, id); await refresh(); onDataChanged(); }
    catch (e) { setMsg("Delete failed."); }
  }
  async function addAgency() {
    if (!agForm.name.trim()) { setMsg("Agency name is required."); return; }
    const payload = {
      ...agForm,
      monthly_fee: agForm.monthly_fee ? Number(agForm.monthly_fee) : null,
      paid_until: agForm.paid_until || null,
    };
    try {
      if (agEditId) {
        await sbUpdate("agencies", agEditId, payload);
        setMsg("Agency updated ✓");
      } else {
        await sbInsert("agencies", { ...payload, active: true });
        setMsg("Agency added ✓");
      }
      setAgForm(blankAgForm);
      setAgEditId(null);
      await refresh();
      onDataChanged();
    } catch (e) { setMsg("Save failed — run the agencies insert/update/delete policies SQL."); }
  }

  function startAgEdit(a) {
    setAgEditId(a.id);
    setAgForm({
      name: a.name || "", phone: a.phone || "", website: a.website || "", areas: a.areas || "",
      blurb: a.blurb || "", contact_name: a.contact_name || "", email: a.email || "",
      monthly_fee: a.monthly_fee != null ? String(a.monthly_fee) : "", paid_until: a.paid_until || "",
    });
    setMsg("");
  }

  const btn = (bg, color, border) => ({
    padding: "7px 12px", borderRadius: 8, border: border || "none", background: bg, color,
    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  });

  if (!ok) {
    return (
      <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}`, maxWidth: 360 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 22, color: T.ink, fontFamily: "Georgia, serif" }}>Admin access</h2>
        <input
          style={{ ...inputStyle, marginBottom: 10, letterSpacing: 4, maxWidth: 180 }}
          type="password" inputMode="numeric" placeholder="••••" value={pin}
          onChange={(e) => { setPin(e.target.value); setPinErr(""); }}
        />
        {pinErr && <p style={{ color: T.danger, fontSize: 13.5, fontWeight: 600, margin: "0 0 10px" }}>{pinErr}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" style={btn(T.primary, "#fff")} onClick={() => (pin === ADMIN_PIN ? setOk(true) : setPinErr("Wrong passcode."))}>Enter</button>
          <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "20px 16px", border: `1px solid ${T.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 22, color: T.ink, fontFamily: "Georgia, serif" }}>Admin</h2>
        <button type="button" style={btn("#fff", T.ink, `1.5px solid ${T.line}`)} onClick={onBack}>Exit</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["caregivers", `Caregivers (${rows.filter((r) => !r.approved).length} pending)`], ["agencies", `Agencies (${ags.length})`]].map(([id, label]) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            style={btn(tab === id ? T.primary : "#fff", tab === id ? "#fff" : T.ink, `1.5px solid ${tab === id ? T.primary : T.line}`)}>
            {label}
          </button>
        ))}
      </div>
      {msg && <p style={{ fontSize: 13.5, fontWeight: 600, color: T.primary, margin: "0 0 10px" }}>{msg}</p>}

      {tab === "caregivers" ? (
        rows.length === 0 ? <p style={{ color: T.inkSoft }}>No caregiver records.</p> :
        rows.map((r) => (
          <div key={r.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${T.line}`, background: r.approved ? "transparent" : "#FCF4E3", borderRadius: 8, marginBottom: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: T.surface, flexShrink: 0 }}>
              {r.photo_url && <img src={r.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: T.ink }}>
                {r.name} {r.featured && <span style={{ color: T.amber }}>★</span>}
              </div>
              <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                {r.city} {r.zip} · {new Date(r.created_at).toLocaleDateString()} · {r.approved ? "✓ approved" : "⏳ PENDING"}
                {r.cert_photo_url && (
                  <> · <a href={r.cert_photo_url} target="_blank" rel="noopener noreferrer" style={{ color: T.primary, fontWeight: 700 }}>📄 View license</a></>
                )}
              </div>
            </div>
            <button type="button" style={btn(r.approved ? "#fff" : T.primary, r.approved ? T.danger : "#fff", r.approved ? `1.5px solid ${T.line}` : "none")}
              onClick={() => patch("caregivers", r.id, { approved: !r.approved })}>
              {r.approved ? "Revoke" : "Approve"}
            </button>
            <button type="button" style={btn("#fff", r.featured ? T.amber : T.inkSoft, `1.5px solid ${T.line}`)} title="Toggle featured"
              onClick={() => patch("caregivers", r.id, { featured: !r.featured })}>
              ★
            </button>
            <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => remove("caregivers", r.id, r.name)}>✕</button>
          </div>
        ))
      ) : (
        <>
          <div style={{ background: T.surface, borderRadius: 12, padding: 14, marginBottom: 14, border: `1px solid ${T.line}` }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: T.ink, marginBottom: 8 }}>{agEditId ? "✎ Editing agency — save to apply changes" : "Add agency ad (after they've paid)"}</div>
            <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="Agency name *" value={agForm.name} onChange={(e) => setAgForm({ ...agForm, name: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder="Phone" value={agForm.phone} onChange={(e) => setAgForm({ ...agForm, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Website (https://…)" value={agForm.website} onChange={(e) => setAgForm({ ...agForm, website: e.target.value })} />
            </div>
            <input style={{ ...inputStyle, marginBottom: 8 }} placeholder="Service areas (e.g. Queens, Brooklyn)" value={agForm.areas} onChange={(e) => setAgForm({ ...agForm, areas: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} placeholder="Contact person" value={agForm.contact_name} onChange={(e) => setAgForm({ ...agForm, contact_name: e.target.value })} />
              <input style={inputStyle} type="email" placeholder="Billing email" value={agForm.email} onChange={(e) => setAgForm({ ...agForm, email: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
              <input style={inputStyle} inputMode="numeric" placeholder="Monthly fee ($)" value={agForm.monthly_fee} onChange={(e) => setAgForm({ ...agForm, monthly_fee: e.target.value })} />
              <input style={inputStyle} type="date" title="Paid until" value={agForm.paid_until} onChange={(e) => setAgForm({ ...agForm, paid_until: e.target.value })} />
            </div>
            <textarea style={{ ...inputStyle, minHeight: 60, marginBottom: 8 }} placeholder="Short blurb shown to families" value={agForm.blurb} onChange={(e) => setAgForm({ ...agForm, blurb: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" style={btn(T.primary, "#fff")} onClick={addAgency}>{agEditId ? "Save changes" : "Publish agency ad"}</button>
              {agEditId && (
                <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => { setAgEditId(null); setAgForm(blankAgForm); }}>Cancel edit</button>
              )}
            </div>
          </div>
          {ags.map((a) => {
            const today = new Date().toISOString().slice(0, 10);
            const expired = a.paid_until && a.paid_until < today;
            const renew = () => {
              const base = a.paid_until && a.paid_until >= today ? new Date(a.paid_until + "T00:00:00") : new Date();
              base.setMonth(base.getMonth() + 1);
              patch("agencies", a.id, { paid_until: base.toISOString().slice(0, 10) });
            };
            return (
            <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 8px", borderBottom: `1px solid ${T.line}`, background: expired ? "#FBEAE5" : "transparent", borderRadius: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: T.ink }}>
                  {a.name} {!a.active && <span style={{ color: T.danger, fontSize: 12 }}>(paused)</span>}
                  {expired && <span style={{ color: T.danger, fontSize: 12, fontWeight: 800 }}> · EXPIRED — ad hidden</span>}
                </div>
                <div style={{ fontSize: 12.5, color: T.inkSoft }}>
                  {a.areas} · {a.phone}{a.contact_name ? ` · ${a.contact_name}` : ""}{a.email ? ` · ${a.email}` : ""}
                </div>
                <div style={{ fontSize: 12.5, color: expired ? T.danger : T.inkSoft, fontWeight: 600 }}>
                  {a.monthly_fee ? `$${a.monthly_fee}/mo · ` : ""}{a.paid_until ? `paid until ${a.paid_until}` : "no billing date set"}
                </div>
              </div>
              <button type="button" style={btn("#fff", T.primary, `1.5px solid ${T.line}`)} title="Edit agency details" onClick={() => startAgEdit(a)}>✎</button>
              <button type="button" style={btn(T.amber, "#3A2A08")} title="Extend one month (payment received)" onClick={renew}>+1 mo</button>
              <button type="button" style={btn("#fff", a.active ? T.danger : T.primary, `1.5px solid ${T.line}`)}
                onClick={() => patch("agencies", a.id, { active: !a.active })}>
                {a.active ? "Pause" : "Activate"}
              </button>
              <button type="button" style={btn("#fff", T.inkSoft, `1.5px solid ${T.line}`)} onClick={() => remove("agencies", a.id, a.name)}>✕</button>
            </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ---------- Legal pages ----------
const LEGAL = {
  privacy: {
    title: "Privacy Policy",
    updated: "Last updated: July 16, 2026",
    sections: [
      ["Information we collect", "When you create an aide profile, we collect the information you provide: your name, photo, phone number, email, city and ZIP code, age, years of experience, hourly rate, languages, services, certifications, and bio. Visitors searching the directory do not need an account and we do not collect their personal information."],
      ["How your information is used", "Aide profile information is displayed publicly in the Pine Crane Care directory so that families seeking care can find and contact you. That is the sole purpose of the directory. We do not sell your personal information."],
      ["Your choices", "You may edit or remove your profile at any time. When you remove your profile, it is no longer shown in the directory. To request removal assistance, contact us using the information below."],
      ["Photos", "Your profile photo is stored and displayed with your profile. Do not upload photos of other people without their permission."],
      ["Data security", "We take reasonable measures to protect the information stored in the directory. However, information you choose to publish in your profile is public by design — do not include information you do not want visible to others (such as your home address)."],
      ["Children", "Pine Crane Care is intended for adults. We do not knowingly collect information from anyone under 18."],
      ["Contact", "Questions about this policy? Contact us at privacy@pinecranecare.com."],
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "Last updated: July 18, 2026",
    sections: [
      ["What Pine Crane Care is", "Pine Crane Care Inc operates a referral platform and directory that helps families find independent caregivers for home care needs, including senior care, child care, and household support. We are not an employer, staffing agency, home care agency, or healthcare provider. Caregivers listed on the platform are independent individuals, not our employees, contractors, or agents. We do not assign, supervise, schedule, or direct any caregiver's work."],
      ["Verification and its limits", "Caregiver profiles are reviewed by Pine Crane Care before appearing in the directory, and the \u201cVerified\u201d badge indicates that we have reviewed the identity and stated credentials the caregiver provided. Verification is a good-faith review, not a guarantee of any person's qualifications, character, or future conduct. Families remain solely responsible for interviewing candidates, checking references, obtaining any background checks they consider necessary, and making their own hiring decisions."],
      ["Memberships and payments", "Certain features, including access to caregivers' full profiles and contact information, require a paid membership or a one-time single unlock. Fees are displayed before purchase. Memberships run for the period purchased and, when auto-renewal is offered and enabled, renew until cancelled; cancellation stops future renewals and takes effect at the end of the current period. Except where required by law, fees are non-refundable once access has been provided. Prices may change with notice; changes apply to future purchases and renewals only."],
      ["Replacement matching", "During an active membership, members may contact additional caregivers and post care requests at no additional platform charge, including when a previous caregiver becomes unavailable. This benefit is continued access to the platform's matching tools; it is not a guarantee that any particular caregiver, or any caregiver at all, will be available, suitable, or willing to accept an engagement."],
      ["Caregiver responsibilities", "By creating a profile, you confirm that all information you provide is truthful and accurate, that you are legally permitted to work in the United States, that certifications you list are genuine and current, and that you will keep your profile up to date. Misrepresentation is grounds for removal from the platform."],
      ["Featured listings", "Caregivers may pay for featured placement in search results. Featured status is a paid promotional position and is labeled as such; it does not reflect a ranking of quality by Pine Crane Care."],
      ["Reviews", "Reviews must reflect the reviewer's genuine, first-hand experience. We may remove reviews that are false, abusive, unrelated to caregiving services, or that violate these terms, but we do not undertake to monitor all content and are not responsible for user-submitted content. Caregivers and clients may not offer or accept anything of value in exchange for reviews."],
      ["Hiring arrangements", "Any employment or service arrangement — including wages, schedules, duties, taxes, withholding, workers' compensation, and insurance — is strictly between the family and the caregiver. Families who hire a caregiver directly may become household employers with legal and tax obligations; consult a qualified professional. Pine Crane Care is not a party to any such arrangement and is not responsible for the acts or omissions of any user."],
      ["Acceptable use", "You may not post false information, impersonate others, harass or discriminate against users, scrape or resell platform data, circumvent payment features, or use the platform for any unlawful purpose. We may suspend or remove accounts, profiles, posts, or reviews that violate these terms."],
      ["Disclaimer and limitation of liability", "The platform is provided \u201cas is\u201d and \u201cas available\u201d without warranties of any kind, express or implied. To the fullest extent permitted by law, Pine Crane Care Inc is not liable for any indirect, incidental, special, consequential, or punitive damages, or for any damages arising from your use of the platform or from any arrangement, interaction, or dispute between users. Where liability cannot be excluded, our total liability is limited to the amounts you paid to us in the twelve months before the claim arose."],
      ["Changes to these terms", "We may update these terms from time to time. We will post the updated terms with a new \u201cLast updated\u201d date, and continued use of the platform after changes take effect means you accept the updated terms."],
      ["Contact", "Questions about these terms? Contact us at support@pinecranecare.com."],
    ],
  },
};

function LegalPage({ kind, onBack }) {
  const { L } = useLang();
  const doc = LEGAL[kind];
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 4px", fontSize: 26, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {doc.title}
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 13.5, color: T.inkSoft }}>{doc.updated}</p>
      {doc.sections.map(([heading, body]) => (
        <div key={heading} style={{ marginBottom: 18 }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 17, color: T.ink }}>{heading}</h3>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.inkSoft }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- Backup / Restore (testing utility) ----------
function BackupPanel({ aides, onRestore, onBack }) {
  const { L } = useLang();
  const [importText, setImportText] = useState("");
  const [status, setStatus] = useState("");
  const exportText = JSON.stringify(aides);

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setStatus("Copied " + aides.length + " profile(s) to clipboard ✓");
    } catch (e) {
      setStatus("Couldn't auto-copy — tap the box below, select all, and copy manually.");
    }
  }

  async function doImport() {
    setStatus("");
    let records;
    try {
      records = JSON.parse(importText);
      if (!Array.isArray(records)) throw new Error();
    } catch (e) {
      setStatus("That doesn't look like valid backup text. Paste the full export, starting with [ and ending with ].");
      return;
    }
    let ok = 0;
    for (const rec of records) {
      if (!rec?.id || !rec?.name) continue;
      try {
        await sbInsert("caregivers", aideToDb(rec));
        ok++;
      } catch (e) { /* skip */ }
    }
    setStatus("Restored " + ok + " profile(s) ✓");
    onRestore(records.filter((r) => r?.id && r?.name));
  }

  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "24px 20px", border: `1px solid ${T.line}` }}>
      <button
        type="button"
        onClick={onBack}
        style={{
          marginBottom: 16, padding: "8px 14px", borderRadius: 999,
          border: `1.5px solid ${T.line}`, background: "#fff", color: T.ink,
          fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {L.back}
      </button>
      <h2 style={{ margin: "0 0 6px", fontSize: 24, color: T.ink, fontFamily: "Georgia, 'Times New Roman', serif" }}>
        Backup & restore (testing)
      </h2>
      <p style={{ margin: "0 0 20px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>
        The demo database resets when the app is updated to a new version. Before an update, copy your
        backup text and save it anywhere (Notepad, an email to yourself). After the update, paste it below to restore.
      </p>

      <h3 style={{ margin: "0 0 8px", fontSize: 16.5, color: T.ink }}>1 · Export current profiles ({aides.length})</h3>
      <button
        type="button"
        onClick={copyExport}
        style={{
          padding: "12px 18px", borderRadius: 10, border: "none", background: T.primary,
          color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", marginBottom: 8,
        }}
      >
        Copy backup to clipboard
      </button>
      <textarea
        readOnly
        value={exportText}
        onFocus={(e) => e.target.select()}
        style={{ ...inputStyle, minHeight: 80, fontSize: 12, fontFamily: "monospace", marginBottom: 20 }}
      />

      <h3 style={{ margin: "0 0 8px", fontSize: 16.5, color: T.ink }}>2 · Restore from a backup</h3>
      <textarea
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
        placeholder="Paste your backup text here…"
        style={{ ...inputStyle, minHeight: 80, fontSize: 12, fontFamily: "monospace", marginBottom: 8 }}
      />
      <button
        type="button"
        onClick={doImport}
        style={{
          padding: "12px 18px", borderRadius: 10, border: `1.5px solid ${T.primary}`, background: "#fff",
          color: T.primary, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        Restore profiles
      </button>
      {status && <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14, fontWeight: 600, color: T.primary }}>{status}</p>}
    </div>
  );
}

// ---------- Main app ----------
export default function App() {
  const [lang, setLangState] = useState(() => {
    try {
      const saved = localStorage.getItem("pcc_lang");
      if (saved && STRINGS[saved]) return saved;
    } catch (e) { /* storage unavailable */ }
    try {
      const nav = (navigator.language || "").toLowerCase();
      if (nav.startsWith("zh")) return "zh";
      if (nav.startsWith("es")) return "es";
    } catch (e) { /* no navigator */ }
    return "en";
  });
  const setLang = (id) => {
    setLangState(id);
    try { localStorage.setItem("pcc_lang", id); } catch (e) { /* storage unavailable */ }
  };
  const L = STRINGS[lang];
  const ts = (s) => (lang === "en" ? s : SERVICE_I18N[s]?.[lang] || s);
  LANG_CURRENT = { lang, L, ts };
  const [view, setView] = useState("directory"); // directory | register | postjob | plans | privacy | terms | backup
  const [tab, setTab] = useState("aides"); // aides | jobs
  const [editing, setEditing] = useState(null); // aide record being edited, or null
  const [jobEditing, setJobEditing] = useState(null); // job record being edited, or null
  const [aides, setAides] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [dbError, setDbError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [toast, setToast] = useState("");
  const [client, setClient] = useState(null); // { plan, subscribedUntil }
  const subscribed = !!(client && client.subscribedUntil > Date.now());
  const [pendingUnlock, setPendingUnlock] = useState(null);
  const unlockedIds = client?.unlocks || [];
  const [aidePro, setAidePro] = useState(null);
  const isAidePro = !!(aidePro && aidePro.proUntil > Date.now());

  useEffect(() => {
    (async () => {
      try {
        setAides(await loadAides());
        setJobs(await loadJobs());
        setReviews(await loadReviews());
        setAgencies(await loadAgencies());
        setDbError(false);
      } catch (e) {
        setDbError(true);
      }
      setLoading(false);
      try {
        const saved = await window.storage.get("client:me", false);
        if (saved?.value) setClient(JSON.parse(saved.value));
      } catch (e) { /* no membership yet */ }
      try {
        const savedPro = await window.storage.get("aidepro:me", false);
        if (savedPro?.value) setAidePro(JSON.parse(savedPro.value));
      } catch (e) { /* not aide pro */ }
    })();
  }, []);

  async function addReview(caregiverId, rev) {
    const saved = await sbInsert("reviews", {
      caregiver_id: caregiverId,
      reviewer_name: rev.name,
      rating: rev.rating,
      comment: rev.comment || null,
    });
    setReviews((list) => [saved, ...list]);
    showToast(L.tReview);
  }

  async function handleDeleteJob(job) {
    try {
      await sbDelete("care_requests", job.id);
    } catch (e) { /* ignore */ }
    setJobs((list) => list.filter((j) => j.id !== job.id));
    showToast(L.tJobRem);
  }

  async function activatePlan(plan) {
    const rec = {
      ...(client || {}),
      plan: plan.name,
      subscribedUntil: Date.now() + plan.months * 30 * 24 * 3600 * 1000,
      activatedAt: Date.now(),
    };
    try {
      await window.storage.set("client:me", JSON.stringify(rec), false);
    } catch (e) { /* still activate in-session */ }
    setClient(rec);
    setPendingUnlock(null);
    setView("directory");
    showToast(L.tMember);
  }

  async function activateAidePro() {
    const rec = { proUntil: Date.now() + 30 * 24 * 3600 * 1000, activatedAt: Date.now() };
    try {
      await window.storage.set("aidepro:me", JSON.stringify(rec), false);
    } catch (e) { /* keep in-session */ }
    setAidePro(rec);
    showToast(L.tAidePro);
  }

  async function activateSingleUnlock() {
    if (!pendingUnlock) return;
    const rec = { ...(client || {}), unlocks: [...(client?.unlocks || []), pendingUnlock] };
    try {
      await window.storage.set("client:me", JSON.stringify(rec), false);
    } catch (e) { /* keep in-session */ }
    setClient(rec);
    setPendingUnlock(null);
    setView("directory");
    showToast(L.tUnlocked);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function handleDelete(aide) {
    try {
      await sbDelete("caregivers", aide.id);
    } catch (e) { /* ignore */ }
    setAides((list) => list.filter((a) => a.id !== aide.id));
    showToast(L.tProfileRem);
  }

  const filtered = aides.filter((a) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      a.zip?.startsWith(q) ||
      a.city?.toLowerCase().includes(q);
    const matchS = !serviceFilter || a.services?.includes(serviceFilter);
    const rate = Number(a.rate);
    const age = Number(a.age);
    const matchRate = !maxRate || (a.rate !== "" && !isNaN(rate) && rate <= Number(maxRate));
    const matchMinAge = !minAge || (a.age !== "" && !isNaN(age) && age >= Number(minAge));
    const matchMaxAge = !maxAge || (a.age !== "" && !isNaN(age) && age <= Number(maxAge));
    return matchQ && matchS && matchRate && matchMinAge && matchMaxAge;
  });

  return (
    <div style={{ minHeight: "100vh", background: T.surface, fontFamily: "'Avenir Next', 'Segoe UI', system-ui, sans-serif", color: T.ink }}>
      {/* Header */}
      <header style={{ background: T.primaryDark, padding: "18px 20px 20px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 10 }}>
            {[["en", "EN"], ["zh", "中文"], ["es", "ES"]].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setLang(id)}
                style={{
                  padding: "5px 12px", borderRadius: 999, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  border: `1.5px solid ${lang === id ? T.amber : "rgba(255,255,255,0.35)"}`,
                  background: lang === id ? T.amber : "transparent",
                  color: lang === id ? "#3A2A08" : "#C9DAD4",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 26, color: "#fff", fontWeight: 700, letterSpacing: 0.2 }}>
                Pine <span style={{ color: T.amber }}>Crane</span> Care
              </div>
              <div style={{ fontSize: 13.5, color: "#C9DAD4" }}>{L.tagline}</div>
            </div>
            {view === "directory" && (
              <button
                type="button"
                onClick={() => { setEditing(null); setView("register"); }}
                style={{
                  padding: "11px 16px", borderRadius: 10, border: "none",
                  background: T.amber, color: "#3A2A08", fontWeight: 800, fontSize: 15,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                {L.join}
              </button>
            )}
          </div>
          {view === "directory" && (
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px", minWidth: 200 }}>
                <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#fff", fontSize: 22, margin: 0, lineHeight: 1.3, fontWeight: 700 }}>
                  {L.heroTitle}
                </h1>
                <p style={{ color: "#C9DAD4", fontSize: 14.5, margin: "8px 0 0", lineHeight: 1.5 }}>
                  {L.heroText}
                </p>
              </div>
              <div style={{ flex: "1 1 260px", minWidth: 240, background: "#FDFCF8", borderRadius: 14, padding: 8, border: `1px solid rgba(255,255,255,0.25)` }}>
                <HeroVisual />
              </div>
            </div>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px 48px" }}>
        {dbError && (
          <div style={{ padding: "12px 16px", background: "#FBEAE5", border: `1.5px solid ${T.danger}`, borderRadius: 12, marginBottom: 14, fontSize: 14, color: T.ink }}>
            ⚠️ <strong>Could not reach the Pine Crane database.</strong> If you're seeing this inside the
            Claude preview, the sandbox may be blocking outside connections — the same code will work
            when deployed to real hosting. (Also check: is the Supabase project paused?)
          </div>
        )}
        {view === "aidelogin" ? (
          <AideLoginView
            onBack={() => setView("directory")}
            onFound={(rec) => { setEditing(rec); setView("register"); window.scrollTo(0, 0); }}
          />
        ) : view === "admin" ? (
          <AdminView
            onBack={() => setView("directory")}
            onDataChanged={async () => {
              try { setAides(await loadAides()); setAgencies(await loadAgencies()); } catch (e) { /* ignore */ }
            }}
          />
        ) : view === "faq" ? (
          <FaqView onBack={() => setView("directory")} />
        ) : view === "privacy" || view === "terms" ? (
          <LegalPage kind={view} onBack={() => setView("directory")} />
        ) : view === "backup" ? (
          <BackupPanel
            aides={aides}
            onRestore={(records) => {
              setAides((list) => {
                const map = new Map(list.map((a) => [a.id, a]));
                for (const r of records) map.set(r.id, r);
                return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
              });
            }}
            onBack={() => setView("directory")}
          />
        ) : view === "postjob" ? (
          <JobForm
            initial={jobEditing}
            onSaved={(rec) => {
              setJobs((list) => [rec, ...list.filter((j) => j.id !== rec.id)]);
              setJobEditing(null);
              setView("directory");
              setTab("jobs");
              showToast(jobEditing ? L.tJobUpd : L.tJobLive);
            }}
            onCancel={() => { setJobEditing(null); setView("directory"); }}
          />
        ) : view === "plans" ? (
          <PlansView onActivate={activatePlan} onBack={() => { setPendingUnlock(null); setView("directory"); }} singleUnlock={!!pendingUnlock} onSingleUnlock={activateSingleUnlock} />
        ) : view === "register" ? (
          <RegisterForm
            initial={editing}
            onSaved={(rec) => {
              if (editing) {
                setAides((list) => list.map((a) => (a.id === rec.id ? rec : a)));
              }
              setEditing(null);
              setView("directory");
              showToast(editing ? L.tProfileUpd : L.tProfileLive);
            }}
            onCancel={() => { setEditing(null); setView("directory"); }}
          />
        ) : (
          <>
            {/* Tabs: find an aide / care requests */}
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["aides", L.tabAides], ["jobs", L.tabJobs], ["agencies", L.tabAgencies]].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  style={{
                    flex: 1, padding: "11px 4px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                    fontSize: 14, fontWeight: 800,
                    border: `2px solid ${tab === id ? T.primary : T.line}`,
                    background: tab === id ? T.primary : "#fff",
                    color: tab === id ? "#fff" : T.ink,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "aides" && (
              <div style={{ textAlign: "right", marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={() => { setView("aidelogin"); window.scrollTo(0, 0); }}
                  style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}
                >
                  {L.manageProfile}
                </button>
              </div>
            )}

            {tab === "jobs" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: T.inkSoft }}>
                    {L.jobsIntro}
                  </p>
                  <button
                    type="button"
                    onClick={() => { setJobEditing(null); setView("postjob"); window.scrollTo(0, 0); }}
                    style={{
                      padding: "11px 16px", borderRadius: 10, border: "none",
                      background: T.primary, color: "#fff", fontWeight: 800, fontSize: 14.5,
                      cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                    }}
                  >
                    {L.postBtn}
                  </button>
                </div>
                {loading ? (
                  <p style={{ textAlign: "center", color: T.inkSoft, marginTop: 40 }}>{L.loadingJobs}</p>
                ) : jobs.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: 48 }}>
                    <div style={{ fontSize: 44 }}>📋</div>
                    <h3 style={{ margin: "10px 0 6px", fontFamily: "Georgia, serif", fontSize: 21 }}>{L.noJobsTitle}</h3>
                    <p style={{ color: T.inkSoft, fontSize: 15, margin: 0 }}>
                      {L.noJobsSub}
                    </p>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 10px" }}>
                      {jobs.length} {L.openSuffix}
                    </p>
                    {jobs.map((j) => (
                      <JobCard
                        key={j.id}
                        job={j}
                        aidePro={isAidePro}
                        onAideProSignup={activateAidePro}
                        onDelete={handleDeleteJob}
                        onEdit={(rec) => { setJobEditing(rec); setView("postjob"); window.scrollTo(0, 0); }}
                      />
                    ))}
                  </>
                )}
              </>
            ) : tab === "agencies" ? (
              <>
                <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: T.ink }}>
                  {L.partnersTitle}
                </h2>
                <p style={{ margin: "0 0 14px", fontSize: 14.5, color: T.inkSoft, lineHeight: 1.5 }}>{L.partnersSub}</p>
                {agencies.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: 40 }}>
                    <div style={{ fontSize: 44 }}>🏛️</div>
                    <p style={{ color: T.inkSoft, fontSize: 15, margin: "10px 0 0" }}>{L.noAgencies}</p>
                  </div>
                ) : agencies.map((ag) => (
                  <div key={ag.id} style={{ background: "#F3F7F5", border: `1px solid ${T.line}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 16, color: T.ink }}>{ag.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: T.inkSoft, border: `1px solid ${T.line}`, borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
                        {L.sponsoredTag}
                      </span>
                    </div>
                    {ag.areas && <div style={{ fontSize: 13, color: T.inkSoft, marginTop: 2 }}>{ag.areas}</div>}
                    {ag.blurb && <p style={{ margin: "8px 0 0", fontSize: 14, color: T.ink, lineHeight: 1.5 }}>{ag.blurb}</p>}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {ag.phone && (
                        <a href={"tel:" + ag.phone} style={{ padding: "9px 16px", borderRadius: 10, background: T.primary, color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                          {L.partnerCall} {ag.phone}
                        </a>
                      )}
                      {ag.website && (
                        <a href={ag.website} target="_blank" rel="noopener noreferrer" style={{ padding: "9px 16px", borderRadius: 10, border: `1.5px solid ${T.primary}`, color: T.primary, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                          {L.partnerSite}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: 13, color: T.inkSoft, marginTop: 16, lineHeight: 1.5 }}>{L.advertiseLine}</p>
              </>
            ) : (
            <>
            {/* Membership status */}
            {subscribed ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#EFF6F3", border: `1px solid ${T.primary}`, borderRadius: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ fontSize: 14, color: T.ink }}>
                  <strong>{L.memberActive}</strong> {new Date(client.subscribedUntil).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "10px 14px", background: "#FCF4E3", border: `1px solid ${T.amber}`, borderRadius: 12, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, color: T.ink }}>
                  {L.browseFree} <strong>{L.membersContact}</strong>{" "}
                  <button
                    type="button"
                    onClick={() => { setView("faq"); window.scrollTo(0, 0); }}
                    style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}
                  >
                    {L.whyMembership}
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => { setPendingUnlock(null); setView("plans"); window.scrollTo(0, 0); }}
                  style={{
                    padding: "9px 16px", borderRadius: 999, border: "none", background: T.amber,
                    color: "#3A2A08", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {L.seePlans}
                </button>
              </div>
            )}

            {/* Client search + filters */}
            <h2 style={{ margin: "0 0 4px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, color: T.ink }}>
              {L.findTitle}
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: 14.5, color: T.inkSoft }}>
              {L.findSub}
            </p>
            <input
              style={{ ...inputStyle, marginBottom: 10 }}
              placeholder={L.searchPh}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.maxRate}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 30" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.ageFrom}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 30" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
              </div>
              <div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.inkSoft, display: "block", marginBottom: 4 }}>{L.ageTo}</span>
                <input style={inputStyle} inputMode="numeric" placeholder="e.g. 60" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
              </div>
            </div>
            {(maxRate || minAge || maxAge || serviceFilter || search) && (
              <button
                type="button"
                onClick={() => { setSearch(""); setServiceFilter(""); setMaxRate(""); setMinAge(""); setMaxAge(""); }}
                style={{
                  marginBottom: 10, padding: "8px 14px", borderRadius: 999,
                  border: `1.5px solid ${T.line}`, background: "#fff", color: T.inkSoft,
                  fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                {L.clearFilters}
              </button>
            )}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 12 }}>
              <Chip label={L.allServices} active={!serviceFilter} onClick={() => setServiceFilter("")} />
              {SERVICES.map((s) => (
                <Chip key={s} label={ts(s)} active={serviceFilter === s} onClick={() => setServiceFilter(s)} />
              ))}
            </div>

            {loading ? (
              <p style={{ textAlign: "center", color: T.inkSoft, marginTop: 40 }}>{L.loadingAides}</p>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: 48 }}>
                <div style={{ fontSize: 44 }}>🤝</div>
                <h3 style={{ margin: "10px 0 6px", fontFamily: "Georgia, serif", fontSize: 21 }}>
                  {aides.length === 0 ? L.noAidesTitle : L.noMatchTitle}
                </h3>
                <p style={{ color: T.inkSoft, fontSize: 15, margin: 0 }}>
                  {aides.length === 0 ? L.noAidesSub : L.noMatchSub}
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13.5, color: T.inkSoft, margin: "0 0 10px" }}>
                  {filtered.length} {L.availableSuffix}
                </p>
                {filtered.map((a) => (
                  <AideCard
                    key={a.id}
                    aide={a}
                    subscribed={subscribed || unlockedIds.includes(a.id)}
                    reviews={reviews.filter((r) => r.caregiver_id === a.id)}
                    onAddReview={addReview}
                    onRequireSub={() => { setPendingUnlock(a.id); setView("plans"); window.scrollTo(0, 0); }}
                    onDelete={handleDelete}
                    onEdit={(rec) => { setEditing(rec); setView("register"); window.scrollTo(0, 0); }}
                  />
                ))}
              </>
            )}

            {/* Medicaid teaser → agencies tab */}
            {agencies.length > 0 && (
              <button
                type="button"
                onClick={() => { setTab("agencies"); window.scrollTo(0, 0); }}
                style={{ width: "100%", marginTop: 18, padding: "13px", borderRadius: 12, border: `1.5px solid ${T.primary}`, background: "#F3F7F5", color: T.primary, fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}
              >
                {L.medicaidTeaser} →
              </button>
            )}
            </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${T.line}`, padding: "20px 16px 28px", textAlign: "center" }}>
        <div style={{ fontSize: 14 }}>
          <button
            type="button"
            onClick={() => { setView("faq"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.faqLink}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("privacy"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.fPrivacy}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("terms"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.fTerms}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("backup"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            {L.fBackup}
          </button>
          <span style={{ color: T.inkSoft }}>·</span>
          <button
            type="button"
            onClick={() => { setView("admin"); window.scrollTo(0, 0); }}
            style={{ background: "none", border: "none", color: T.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", padding: "4px 8px" }}
          >
            Admin
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 12.5, color: T.inkSoft }}>
          {L.fCopy} · {APP_VERSION}
        </p>
      </footer>

      {toast && (
        <div
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: T.ink, color: "#fff", padding: "12px 20px", borderRadius: 999,
            fontSize: 15, fontWeight: 600, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
