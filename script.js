let selectedColor = '#ffffff';

function selectColor(color, btnElement) {
    selectedColor = color;
    const btns = document.querySelectorAll('#modalOverlay .color-btn');
    btns.forEach(btn => btn.classList.remove('selected'));
    if(btnElement) btnElement.classList.add('selected');
}

function openModal() {
    document.getElementById('modalOverlay').style.display = 'flex';
    selectColor('#ffffff', document.querySelector('#modalOverlay .color-btn')); // 모달 열 때 기본 색상(첫 번째) 선택
}
function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    document.getElementById('scheduleInput').value = ''; // 창 닫을 때 입력값 초기화
    document.getElementById('dateInput').value = '';
}
function saveSchedule() {
    const dateStr = document.getElementById('dateInput').value.trim();
    const text = document.getElementById('scheduleInput').value.trim();
    
    if (!dateStr) return alert("날짜를 입력해주세요!");
    if (!text) return alert("일정을 입력해주세요!");

    let startDay, endDay;
    
    if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        startDay = parseInt(parts[0], 10);
        endDay = parseInt(parts[1], 10);
    } else {
        startDay = parseInt(dateStr, 10);
        endDay = startDay;
    }
    
    if (isNaN(startDay) || isNaN(endDay) || startDay < 1 || endDay > 30 || startDay > endDay) {
        return alert("1부터 30 사이의 유효한 날짜 또는 기간(예: 2-6)을 입력해주세요!");
    }
    
    const boxes = document.querySelectorAll('.grid .box:not(.day-header)');
    
    // 지정된 기간(또는 단일 날짜)만큼 반복하여 일정 스티커 추가
    for (let i = startDay; i <= endDay; i++) {
        const targetBox = boxes[i - 1];
        const scheduleDiv = document.createElement('div');
        scheduleDiv.className = 'schedule-item';
        scheduleDiv.textContent = text;
        scheduleDiv.style.backgroundColor = selectedColor;
        scheduleDiv.dataset.color = selectedColor; // 상세 보기 시 색상 유지를 위한 데이터 저장
        scheduleDiv.onclick = function(e) { 
            e.stopPropagation(); // 칸 클릭(크게 보기) 이벤트와 겹치지 않게 방지
            openEditModal(this); 
        };
        targetBox.appendChild(scheduleDiv);
    }

    closeModal();
}

let currentEditItem = null;

function openEditModal(element) {
    currentEditItem = element;
    document.getElementById('editScheduleInput').value = element.textContent;
    document.getElementById('editModalOverlay').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editModalOverlay').style.display = 'none';
    currentEditItem = null;
}

function updateSchedule() {
    if (!currentEditItem) return;
    const newText = document.getElementById('editScheduleInput').value.trim();
    if (!newText) return alert("일정을 입력해주세요!");
    currentEditItem.textContent = newText;
    closeEditModal();
}

function deleteSchedule() {
    if (!currentEditItem) return;
    if (confirm("이 일정을 삭제하시겠습니까?")) {
        currentEditItem.remove();
        closeEditModal();
    }
}

// 날짜 칸 클릭 시 크게 보기 기능 추가
const dateBoxes = document.querySelectorAll('.grid .box:not(.day-header)');
dateBoxes.forEach((box, index) => {
    box.addEventListener('click', function() {
        const schedules = this.querySelectorAll('.schedule-item');
        if (schedules.length > 0) {
            openCellViewModal(index + 1, Array.from(schedules));
        }
    });
});

function openCellViewModal(day, schedules) {
    document.getElementById('cellViewTitle').textContent = `6월 ${day}일 일정`;
    const listContainer = document.getElementById('cellViewList');
    listContainer.innerHTML = ''; 

    schedules.forEach(sch => {
        const div = document.createElement('div');
        div.className = 'cell-view-item';
        div.textContent = sch.textContent;
        div.style.backgroundColor = sch.dataset.color || '#f1efe2';
        listContainer.appendChild(div);
    });
    document.getElementById('cellViewModalOverlay').style.display = 'flex';
}

function closeCellViewModal() {
    document.getElementById('cellViewModalOverlay').style.display = 'none';
}