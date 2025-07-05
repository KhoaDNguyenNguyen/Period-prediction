 const urlParams = new URLSearchParams(window.location.search);
 const urlToken  = urlParams.get('token');
 if (urlToken) {
   localStorage.setItem('token', urlToken);
   // Xóa query để khỏi process lại
   window.history.replaceState({}, document.title, window.location.pathname);
 }
function getToken() {
   return localStorage.getItem('token');
 }
//  if (!getToken()) window.location.replace('login.html');
if (!getToken()) window.location.replace('login.html');
const DEV_HOSTS = ['localhost', '127.0.0.1'];
const API = DEV_HOSTS.includes(window.location.hostname)
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;


const surveyJson = {
  title: "Khảo sát sức khỏe nhằm dự đoán chu kỳ kinh nguyệt",
  showProgressBar: "top",
  firstPageIsStarted: true,
  startSurveyText: "Bắt đầu",
  pageNextText: "Tiếp",
  completeText: "Gửi",
  completedHtml: "<h3>Xin cảm ơn bạn đã hoàn thành khảo sát!</h3>",
  pages: [
    /* ---------- 1. Thông tin cá nhân ---------- */
    {
      title: "Thông tin cơ bản",
      elements: [
        { type: "text", name: "age", title: "01. Tuổi hiện tại của bạn?", inputType: "number", isRequired: true},
        { type: "text", name: "height_cm", title: "02. Chiều cao của bạn (cm)?", inputType: "number", isRequired: true},
        { type: "text", name: "weight_kg", title: "03. Cân nặng của bạn (kg)?", inputType: "number", isRequired: true},
        { type: "text", name: "menarche_age", title: "04. Tuổi có kinh lần đầu (menarche)?", inputType: "number", isRequired: true},
        { type: "text", name: "parity", title: "05. Bạn đã sinh con chưa? (nếu có, nhập số lần; nếu chưa, nhập 0)", inputType: "number", isRequired: true}
      ]
    },

    /* ---------- 2. Dữ liệu chu kỳ ---------- */
    {
      title: "Thông tin chu kỳ gần đây",
      elements: [
        {
          type: "paneldynamic",
          name: "cycle_history",
          title: "06. Trong 12 chu kỳ gần nhất, hãy liệt kê ngày bắt đầu và độ dài từng chu kỳ (ngày).",
          templateTitle: "Chu kỳ {panelIndex}",
          panelCount: 3,
          maxPanelCount: 12,
          panelAddText: "Thêm chu kỳ",
          templateElements: [
            { type: "text", name: "cycle_start", title: "Ngày bắt đầu", inputType: "date", isRequired: true},
            { type: "text", name: "cycle_length", title: "Độ dài chu kỳ (ngày)", inputType: "number", min: 15, max: 60, isRequired: true}
          ]
        },
        { type: "text", name: "bleeding_days_avg", title: "07. Số ngày hành kinh trung bình mỗi chu kỳ?", inputType: "number", isRequired: true},
        {
          type: "checkbox", isRequired: true,
          name: "menstruation_symptoms",
          title: "08. Bạn thường gặp triệu chứng nào khi hành kinh?",
          choices: ["đau bụng","đau lưng","cục máu đông","rong kinh","không triệu chứng","khác"]
        },
        {
          type: "radiogroup", isRequired: true,
          name: "tracking_method",
          title: "09. Bạn theo dõi chu kỳ bằng cách nào?",
          choices: ["Ứng dụng","Lịch giấy", "Nhẩm mồm", "Không theo dõi","Khác"]
        }
      ]
    },

    /* ---------- 3. Lối sống ---------- */
    {
      title: "Lối sống",
      elements: [
{
  "type": "text", isRequired: true,
  "name": "sleep_hours",
  "title": "10. Trung bình bạn ngủ mấy giờ/đêm?",
  "inputType": "number"
},
{
  "type": "multipletext", isRequired: true,
  "name": "bedtime_range",
  "title": "Ước tính khoảng giờ đi ngủ (HH:MM)",
  "items": [
    { "name": "from", "title": "Từ", "inputType": "time" },
    { "name": "to",   "title": "Đến", "inputType": "time" }
  ]
},
{
  "type": "multipletext", isRequired: true,
  "name": "wake_time_range",
  "title": "Ước tính khoảng giờ thức dậy (HH:MM)",
  "items": [
    { "name": "from", "title": "Từ", "inputType": "time" },
    { "name": "to",   "title": "Đến", "inputType": "time" }
  ]
},

        {
          type: "dropdown", isRequired: true,
          name: "physical_activity",
          title: "11. Mức độ hoạt động thể chất mỗi tuần?",
          choices: ["Ít (≤1 buổi/tuần)","Trung bình (2–4 buổi/tuần)","Cao (≥5 buổi/tuần)"]
        },
        {
          type: "radiogroup", isRequired: true,
          name: "diet",
          title: "12. Chế độ ăn hiện tại?",
          choices: ["Đa dạng","Ăn kiêng","Thuần chay","Ít carb","Khác"]
        },
        { type: "text", name: "alcohol_per_week", title: "13. Tần suất uống rượu (ly/tuần)?", inputType: "number",isRequired: true},
        { type: "text", name: "coffee_per_day", title: "14. Tần suất uống cà-phê (ly/ngày)?", inputType: "number", isRequired: true},
        {
          type: "radiogroup", isRequired: true,
          name: "smoking",
          title: "15. Bạn có hút thuốc không?",
          choices: [{value:true,text:"Có"},{value:false,text:"Không"}]
        },
        {
          type: "radiogroup", isRequired: true,
          name: "shift_work",
          title: "16. Bạn có làm ca đêm hoặc thường xuyên thay đổi múi giờ?",
          choices: [{value:true,text:"Có"},{value:false,text:"Không"}]
        }
      ]
    },

    /* ---------- 4. Yếu tố y khoa ---------- */
    {
      title: "Yếu tố y khoa",
      elements: [
        {
          type: "radiogroup", isRequired: true,
          name: "hbc_using",
          title: "17. Bạn đang dùng biện pháp tránh thai nội tiết?",
          choices: [{value:true,text:"Có"},{value:false,text:"Không"}]
        },
        { type: "text", name: "hbc_type", title: "Loại (thuốc viên/vòng cấy/miếng dán…)", visibleIf: "{hbc_using} = true", isRequired: true},
        { type: "text", name: "hbc_duration_months", title: "Thời gian sử dụng (tháng)", inputType: "number", visibleIf: "{hbc_using} = true", isRequired: true},
        {
          type: "checkbox",
          name: "diagnosed_conditions",
          title: "18. Bạn từng được chẩn đoán bệnh nội tiết/chuyển hoá nào?",
          isRequired: true,
          hasOther: true,        
          otherText: "Khác",
          choices: [
            "PCOS", "Cường giáp", "Suy giáp", "Tiểu đường", "Rối loạn ăn uống",
            { value: "Không", text: "Không", isExclusive: true }  // “Không” độc lập, không chọn kèm
          ]
        },

        {
          type: "radiogroup", isRequired: true,
          name: "pregnancy_breastfeeding_menopause",
          title: "19. Hiện bạn có mang thai, cho con bú hoặc tiền mãn kinh không?",
          choices: ["Có","Không"]
        },
/* --- 20. Thuốc/hormone/thực phẩm chức năng --- */
{
  type: "radiogroup",
  name: "current_drugs_using",
  title: "20. Bạn đang dùng thuốc/hormone/thực phẩm chức năng nào có thể ảnh hưởng chu kỳ?",
  isRequired: true,
  choices: [{ value: true, text: "Có" }, { value: false, text: "Không" }]
},
{
  type: "paneldynamic",
  name: "current_drugs_list",
  title: "Liệt kê thuốc & liều",
  templateTitle: "Thuốc {panelIndex}",
  panelCount: 1,
  minPanelCount: 1,
  maxPanelCount: 20,
  panelAddText: "Thêm thuốc",
  panelRemoveText: "Xóa thuốc",
  visibleIf: "{current_drugs_using} = true",
  isRequired: true,
  templateElements: [
    { type: "text",  name: "drug_name",       title: "Tên thuốc",               isRequired: true },
    { type: "text",  name: "doses_per_day",   title: "Số liều dùng/ngày",       inputType: "number", min: 1, isRequired: true },
    { type: "text",  name: "drug_start_date", title: "Bắt đầu dùng (yyyy-mm-dd)",inputType: "date",   isRequired: true }
  ]
},



    /* --- 21. Phẫu thuật / thay đổi cân nặng --- */
    {
      type: "radiogroup",
      name: "recent_surgery_or_weight_change",
      title: "21. 3 tháng qua bạn có phẫu thuật hoặc thay đổi cân nặng > 5 %?",
      choices: ["Có", "Không"],
      isRequired: true
    }
  ]
},

    /* ---------- 5. Căng thẳng ---------- */
    {
      title: "Căng thẳng",
      elements: [
        {
          type: "rating", isRequired: true,
          name: "stress_level_1_to_5",
          title: "22. Thang 1–5, mức độ stress trung bình trong tháng gần nhất?",
          rateMin: 1, rateMax: 5
        },
        {
          type: "radiogroup", isRequired: true,
          name: "major_stress_event_bool",
          title: "23. Bạn có trải qua sự kiện căng thẳng lớn gần đây không?",
          choices: ["Có","Không"]
        },
        { type: "comment", name: "major_stress_event", title: "Mô tả sự kiện", visibleIf: "{major_stress_event_bool} = 'Có'", isRequired: true}
      ]
    },

    /* ---------- 6. Tuỳ chọn mô hình & bảo mật ---------- */
    {
      title: "Tuỳ chọn mô hình & bảo mật",
      elements: [
        { type: "text", name: "prediction_window_days", title: "24. Bạn muốn mô hình dự đoán trước bao nhiêu ngày?", inputType: "number", isRequired: true},
        { type: "text", name: "min_expected_accuracy_percent", title: "25. Độ chính xác tối thiểu bạn kỳ vọng (%)?", inputType: "number", min: 50, max: 100 },
        { type: "radiogroup", name: "data_update_frequency", title: "26. Bạn sẵn sàng cập nhật dữ liệu định kỳ cỡ nào?", choices: ["Hàng ngày","Hàng tuần","Hàng tháng","Không"], isRequired: true},
        { type: "radiogroup", name: "data_anonymized_consent", title: "27. Bạn đồng ý ẩn danh dữ liệu để phục vụ nghiên cứu?", choices: [{value:true,text:"Có"},{value:false,text:"Không"}], isRequired: true},
        { type: "radiogroup", name: "lifestyle_recommendations_opt_in", title: "28. Bạn có muốn nhận khuyến nghị cải thiện chu kỳ dựa trên lối sống?", choices: [{value:true,text:"Có"},{value:false,text:"Không"}], isRequired: true }
      ]
    }
  ]
};

const surveyModel = new Survey.Model(surveyJson);


function buildOutput(data) {
  const n = v => (v === undefined || v === null || v === "" ? null : v);

  const basic_profile = {
    age: n(data.age), height_cm: n(data.height_cm), weight_kg: n(data.weight_kg),
    menarche_age: n(data.menarche_age), parity: n(data.parity)
  };

  const cycle_history = Array.isArray(data.cycle_history)
    ? data.cycle_history.map(p => ({ cycle_start: n(p.cycle_start), cycle_length: n(p.cycle_length) }))
    : [];

  const lifestyle = {
    sleep_hours: n(data.sleep_hours), bedtime: n(data.bedtime), wake_time: n(data.wake_time),
    physical_activity: n(data.physical_activity), diet: n(data.diet),
    alcohol_per_week: n(data.alcohol_per_week), coffee_per_day: n(data.coffee_per_day),
    smoking: data.smoking ?? null, shift_work: data.shift_work ?? null
  };

  const medical_factors = {
    hormonal_birth_control: {
      using: data.hbc_using ?? null, type: n(data.hbc_type), duration_months: n(data.hbc_duration_months)
    },
    diagnosed_conditions: Array.isArray(data.diagnosed_conditions) ? data.diagnosed_conditions : null,
    pregnancy_breastfeeding_menopause: n(data.pregnancy_breastfeeding_menopause)
  };

const medications_recent_changes = {
  current_drugs: (data.current_drugs_using === true && Array.isArray(data.current_drugs_list))
    ? data.current_drugs_list.map(p => ({
        drug_name:      p.drug_name       ?? null,
        doses_per_day:  p.doses_per_day   ?? null,
        start_date:     p.drug_start_date ?? null
      }))
    : [],
  recent_surgery_or_weight_change: n(data.recent_surgery_or_weight_change)
};



  const stress = {
    stress_level_1_to_5: n(data.stress_level_1_to_5),
    major_stress_event: data.major_stress_event_bool === "Có" ? n(data.major_stress_event) : null
  };

  const model_preferences = {
    prediction_window_days: n(data.prediction_window_days),
    min_expected_accuracy_percent: n(data.min_expected_accuracy_percent),
    data_update_frequency: n(data.data_update_frequency)
  };

  const privacy_and_recommendations = {
    data_anonymized_consent: data.data_anonymized_consent ?? null,
    lifestyle_recommendations_opt_in: data.lifestyle_recommendations_opt_in ?? null
  };

  return {
    basic_profile,
    cycle_history,
    bleeding_days_avg: n(data.bleeding_days_avg),
    menstruation_symptoms: Array.isArray(data.menstruation_symptoms) ? data.menstruation_symptoms : null,
    tracking_method: n(data.tracking_method),
    lifestyle,
    medical_factors,
    medications_recent_changes,
    stress,
    model_preferences,
    privacy_and_recommendations
  };
}

function displayResults(sender) {
  const out   = buildOutput(sender.data);
  const token = localStorage.getItem('token');     // 🟢 lấy JWT

  fetch(`${API}/survey`, {
    method: 'POST',
  headers: {
   'Content-Type': 'application/json',
   ...(getToken() && { Authorization: `Bearer ${getToken()}` })
 },
    body: JSON.stringify(out)
  })
.then(res => {
  // 1. Session hết hạn hoặc token invalid → về login
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    alert('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại.');
    return window.location.replace('/login.html');
  }
  // 2. Dữ liệu không hợp lệ (ví dụ InvalidUserID) → báo và dừng
  if (res.status === 400) {
    alert('Dữ liệu không hợp lệ. Vui lòng thử lại.');
    throw new Error('Bad Request');
  }
  // 3. Những lỗi khác (500+) → ném chung
  if (!res.ok) {
    throw new Error('Lưu database thất bại');
  }
  // 4. Bình thường backend trả 201 với body { message: 'Survey saved' }
  return res.text().then(t => t ? JSON.parse(t) : {});
})

    .then(() => {
      document.getElementById('surveyResults').textContent =
        JSON.stringify(out, null, 2);
    })
    .catch(err => alert(err.message));
}


// 6. Đăng ký sự kiện onComplete và render survey
surveyModel.onComplete.add(displayResults);

const renderSurvey = () =>
  surveyModel.render(document.getElementById("surveyContainer"));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderSurvey);
} else {
  // DOMContentLoaded đã bắn xong → render ngay
  renderSurvey();
}

