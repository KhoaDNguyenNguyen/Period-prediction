import * as Survey from 'survey-core';

const surveyJson = {
  title: 'Khảo sát sức khỏe nhằm dự đoán chu kỳ kinh nguyệt',
  showProgressBar: 'top',
  firstPageIsStarted: true,
  startSurveyText: 'Bắt đầu',
  pageNextText: 'Tiếp',
  completeText: 'Gửi',
  completedHtml: '<h3>Xin cảm ơn bạn đã hoàn thành khảo sát!</h3>',
  pages: [
  // personal information, cycle data, lifestyle, medical factors, stress, model options
    {
      title: 'Thông tin cơ bản',
      elements: [
        {
          type: 'text',
          name: 'age',
          title: '01. Tuổi hiện tại của bạn?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'height_cm',
          title: '02. Chiều cao của bạn (cm)?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'weight_kg',
          title: '03. Cân nặng của bạn (kg)?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'menarche_age',
          title: '04. Tuổi có kinh lần đầu (menarche)?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'parity',
          title: '05. Bạn đã sinh con chưa? (nếu có, nhập số lần; nếu chưa, nhập 0)',
          inputType: 'number',
          isRequired: true,
        },
      ],
    },

    // cycle data
    {
      title: 'Thông tin chu kỳ gần đây',
      elements: [
        {
          type: 'paneldynamic',
          name: 'cycle_history',
          title:
            '06. Trong 12 chu kỳ gần nhất, hãy liệt kê ngày bắt đầu và độ dài từng chu kỳ (ngày).',
          templateTitle: 'Chu kỳ {panelIndex}',
          panelCount: 3,
          maxPanelCount: 12,
          panelAddText: 'Thêm chu kỳ',
          templateElements: [
            {
              type: 'text',
              name: 'cycle_start',
              title: 'Ngày bắt đầu',
              inputType: 'date',
              isRequired: true,
            },
            {
              type: 'text',
              name: 'cycle_length',
              title: 'Độ dài chu kỳ (ngày)',
              inputType: 'number',
              min: 15,
              max: 60,
              isRequired: true,
            },
          ],
        },
        {
          type: 'text',
          name: 'bleeding_days_avg',
          title: '07. Số ngày hành kinh trung bình mỗi chu kỳ?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'checkbox',
          isRequired: true,
          name: 'menstruation_symptoms',
          title: '08. Bạn thường gặp triệu chứng nào khi hành kinh?',
          choices: [
            'đau bụng',
            'đau lưng',
            'cục máu đông',
            'rong kinh',
            'không triệu chứng',
            'khác',
          ],
        },
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'tracking_method',
          title: '09. Bạn theo dõi chu kỳ bằng cách nào?',
          choices: ['Ứng dụng', 'Lịch giấy', 'Nhẩm mồm', 'Không theo dõi', 'Khác'],
        },
      ],
    },

    // lifestyle
    {
      title: 'Lối sống',
      elements: [
        {
          type: 'text',
          isRequired: true,
          name: 'sleep_hours',
          title: '10. Trung bình bạn ngủ mấy giờ/đêm?',
          inputType: 'number',
        },
        {
          type: 'multipletext',
          isRequired: true,
          name: 'bedtime_range',
          title: 'Ước tính khoảng giờ đi ngủ (HH:MM)',
          items: [
            {name: 'from', title: 'Từ', inputType: 'time'},
            {name: 'to', title: 'Đến', inputType: 'time'},
          ],
        },
        {
          type: 'multipletext',
          isRequired: true,
          name: 'wake_time_range',
          title: 'Ước tính khoảng giờ thức dậy (HH:MM)',
          items: [
            {name: 'from', title: 'Từ', inputType: 'time'},
            {name: 'to', title: 'Đến', inputType: 'time'},
          ],
        },

        {
          type: 'dropdown',
          isRequired: true,
          name: 'physical_activity',
          title: '11. Mức độ hoạt động thể chất mỗi tuần?',
          choices: ['Ít (≤1 buổi/tuần)', 'Trung bình (2–4 buổi/tuần)', 'Cao (≥5 buổi/tuần)'],
        },
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'diet',
          title: '12. Chế độ ăn hiện tại?',
          choices: ['Đa dạng', 'Ăn kiêng', 'Thuần chay', 'Ít carb', 'Khác'],
        },
        {
          type: 'text',
          name: 'alcohol_per_week',
          title: '13. Tần suất uống rượu (ly/tuần)?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'coffee_per_day',
          title: '14. Tần suất uống cà-phê (ly/ngày)?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'smoking',
          title: '15. Bạn có hút thuốc không?',
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
        },
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'shift_work',
          title: '16. Bạn có làm ca đêm hoặc thường xuyên thay đổi múi giờ?',
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
        },
      ],
    },

    // medical factors
    {
      title: 'Yếu tố y khoa',
      elements: [
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'hbc_using',
          title: '17. Bạn đang dùng biện pháp tránh thai nội tiết?',
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
        },
        {
          type: 'text',
          name: 'hbc_type',
          title: 'Loại (thuốc viên/vòng cấy/miếng dán…)',
          visibleIf: '{hbc_using} = true',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'hbc_duration_months',
          title: 'Thời gian sử dụng (tháng)',
          inputType: 'number',
          visibleIf: '{hbc_using} = true',
          isRequired: true,
        },
        {
          type: 'checkbox',
          name: 'diagnosed_conditions',
          title: '18. Bạn từng được chẩn đoán bệnh nội tiết/chuyển hoá nào?',
          isRequired: true,
          hasOther: true,
          otherText: 'Khác',
          choices: [
            'PCOS',
            'Cường giáp',
            'Suy giáp',
            'Tiểu đường',
            'Rối loạn ăn uống',
            {value: 'Không', text: 'Không', isExclusive: true}, // exclusive choice
          ],
        },

        {
          type: 'radiogroup',
          isRequired: true,
          name: 'pregnancy_breastfeeding_menopause',
          title: '19. Hiện bạn có mang thai, cho con bú hoặc tiền mãn kinh không?',
          choices: ['Có', 'Không'],
        },
        // current drugs
        {
          type: 'radiogroup',
          name: 'current_drugs_using',
          title: '20. Bạn đang dùng thuốc/hormone/thực phẩm chức năng nào có thể ảnh hưởng chu kỳ?',
          isRequired: true,
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
        },
        {
          type: 'paneldynamic',
          name: 'current_drugs_list',
          title: 'Liệt kê thuốc & liều',
          templateTitle: 'Thuốc {panelIndex}',
          panelCount: 1,
          minPanelCount: 1,
          maxPanelCount: 20,
          panelAddText: 'Thêm thuốc',
          panelRemoveText: 'Xóa thuốc',
          visibleIf: '{current_drugs_using} = true',
          isRequired: true,
          templateElements: [
            {type: 'text', name: 'drug_name', title: 'Tên thuốc', isRequired: true},
            {
              type: 'text',
              name: 'doses_per_day',
              title: 'Số liều dùng/ngày',
              inputType: 'number',
              min: 1,
              isRequired: true,
            },
            {
              type: 'text',
              name: 'drug_start_date',
              title: 'Bắt đầu dùng (yyyy-mm-dd)',
              inputType: 'date',
              isRequired: true,
            },
          ],
        },

        // recent surgery or weight change
        {
          type: 'radiogroup',
          name: 'recent_surgery_or_weight_change',
          title: '21. 3 tháng qua bạn có phẫu thuật hoặc thay đổi cân nặng > 5 %?',
          choices: ['Có', 'Không'],
          isRequired: true,
        },
      ],
    },

    // stress
    {
      title: 'Căng thẳng',
      elements: [
        {
          type: 'rating',
          isRequired: true,
          name: 'stress_level_1_to_5',
          title: '22. Thang 1–5, mức độ stress trung bình trong tháng gần nhất?',
          rateMin: 1,
          rateMax: 5,
        },
        {
          type: 'radiogroup',
          isRequired: true,
          name: 'major_stress_event_bool',
          title: '23. Bạn có trải qua sự kiện căng thẳng lớn gần đây không?',
          choices: ['Có', 'Không'],
        },
        {
          type: 'comment',
          name: 'major_stress_event',
          title: 'Mô tả sự kiện',
          visibleIf: "{major_stress_event_bool} = 'Có'",
          isRequired: true,
        },
      ],
    },

    // model options & privacy
    {
      title: 'Tuỳ chọn mô hình & bảo mật',
      elements: [
        {
          type: 'text',
          name: 'prediction_window_days',
          title: '24. Bạn muốn mô hình dự đoán trước bao nhiêu ngày?',
          inputType: 'number',
          isRequired: true,
        },
        {
          type: 'text',
          name: 'min_expected_accuracy_percent',
          title: '25. Độ chính xác tối thiểu bạn kỳ vọng (%)?',
          inputType: 'number',
          min: 50,
          max: 100,
        },
        {
          type: 'radiogroup',
          name: 'data_update_frequency',
          title: '26. Bạn sẵn sàng cập nhật dữ liệu định kỳ cỡ nào?',
          choices: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng', 'Không'],
          isRequired: true,
        },
        {
          type: 'radiogroup',
          name: 'data_anonymized_consent',
          title: '27. Bạn đồng ý ẩn danh dữ liệu để phục vụ nghiên cứu?',
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
          isRequired: true,
        },
        {
          type: 'radiogroup',
          name: 'lifestyle_recommendations_opt_in',
          title: '28. Bạn có muốn nhận khuyến nghị cải thiện chu kỳ dựa trên lối sống?',
          choices: [
            {value: true, text: 'Có'},
            {value: false, text: 'Không'},
          ],
          isRequired: true,
        },
      ],
    },
  ],
};

const survey = new Survey.Model(surveyJson);

survey.onComplete.add((sender) => {
  document.getElementById('resultsContainer').style.display = 'block';
  document.getElementById('surveyResults').textContent = JSON.stringify(sender.data, null, 2);
});

survey.render('surveyContainer');
