(async () => {
    // 지연 시간을 설정하는 함수 (밀리초 단위)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * 재귀적으로 모든 프레임을 검색하여 특정 ID를 가진 요소를 찾습니다.
     * @param {string} id - 찾고자 하는 요소의 ID
     * @param {Window} currentWindow - 현재 검색 중인 윈도우 객체
     * @returns {HTMLElement|null} - 찾은 요소 또는 null
     */
    const findElementRecursively = (id, currentWindow = window) => {
        try {
            const el = currentWindow.document.getElementById(id);
            if (el) return el;
            for (let i = 0; i < currentWindow.frames.length; i++) {
                const found = findElementRecursively(id, currentWindow.frames[i]);
                if (found) return found;
            }
        } catch (e) {
            // 다른 도메인의 프레임은 접근할 수 없으므로 무시합니다.
        }
        return null;
    };

    /**
     * 특정 ID를 가진 요소가 나타날 때까지 대기합니다.
     * @param {string} id - 찾고자 하는 요소의 ID
     * @param {number} timeout - 대기 시간(밀리초)
     * @returns {Promise<HTMLElement>} - 찾은 요소
     */
    const waitForElement = async (id, timeout = 10000) => {
        const interval = 500;
        let elapsed = 0;
        while (elapsed < timeout) {
            const el = findElementRecursively(id);
            if (el) return el;
            await sleep(interval);
            elapsed += interval;
        }
        throw new Error(`Element with id "${id}" not found within ${timeout}ms`);
    };

    try {
        console.log('cPage와 tPage 요소를 찾고 있습니다...');
        // 'cPage'와 'tPage' 요소를 기다립니다.
        const cPageElement = await waitForElement('cPage');
        const tPageElement = await waitForElement('tPage');

        /**
         * 현재 페이지 번호를 가져옵니다.
         * @returns {number}
         */
        const getCurrentPage = () => Number(cPageElement.innerText.trim());

        /**
         * 마지막 페이지 번호를 가져옵니다.
         * @returns {number}
         */
        const getLastPage = () => Number(tPageElement.innerText.trim());

        let currentPage = getCurrentPage();
        const lastPage = getLastPage();

        console.log(`시작 페이지: ${currentPage} / 마지막 페이지: ${lastPage}`);

        // 최대 시도 횟수를 설정하여 무한 루프 방지
        const maxAttempts = lastPage - currentPage + 10; // 여유를 두고 설정
        let attempts = 0;

        // 모든 페이지를 순회할 때까지 반복
        while (currentPage < lastPage && attempts < maxAttempts) {
            attempts += 1;
            console.log(`\n[Attempt ${attempts}] 현재 페이지: ${currentPage} / 마지막 페이지: ${lastPage}`);

            // 'nextBtn' 요소 찾기
            const nextBtn = findElementRecursively('nextBtn');

            if (!nextBtn) {
                console.error('다음 페이지 버튼(nextBtn)을 찾을 수 없습니다.');
                break;
            }

            // "다음 페이지" 버튼이 비활성화 상태인 경우 강제로 활성화
            if (nextBtn.disabled || nextBtn.style.pointerEvents === 'none' || parseFloat(nextBtn.style.opacity) < 1) {
                console.log('다음 페이지 버튼이 비활성화 상태입니다. 활성화합니다...');
                nextBtn.disabled = false; // 'disabled' 속성 제거
                nextBtn.style.pointerEvents = 'auto'; // 'pointer-events' 활성화
                nextBtn.style.opacity = '1'; // 'opacity' 변경
            }

            // 버튼 클릭을 시뮬레이션합니다.
            nextBtn.click();
            console.log(`다음 페이지(${currentPage + 1})로 이동 시도 중...`);

            // 페이지 전환을 기다립니다.
            await sleep(3000); // 3초 대기 (필요에 따라 조정)

            // 페이지가 실제로 변경되었는지 확인합니다.
            const newPage = getCurrentPage();
            if (newPage === currentPage) {
                console.warn('페이지가 정상적으로 변경되지 않았습니다. 다시 시도합니다...');
                // 추가 시도 또는 스크립트 종료
                continue; // 다음 시도로 넘어갑니다.
            } else {
                currentPage = newPage;
                console.log(`현재 페이지가 ${currentPage}으로 변경되었습니다.`);
            }
        }

        if (attempts >= maxAttempts) {
            console.warn('최대 시도 횟수에 도달하여 스크립트를 종료합니다.');
        }

        // 마지막 페이지 도달 시 완료 버튼 클릭
        if (currentPage >= lastPage) {
            const finishButton = findElementRecursively('finishBtn') || document.querySelector('.btnm.btnCyan.radius4');
            if (finishButton) {
                finishButton.click();
                console.log('모든 페이지를 완료했습니다.');
            } else {
                console.warn('완료 버튼을 찾을 수 없습니다.');
            }
        } else {
            console.warn('모든 페이지를 완료하지 못했습니다.');
        }

    } catch (error) {
        console.error('스크립트 실행 중 오류가 발생했습니다:', error);
    }
})();
