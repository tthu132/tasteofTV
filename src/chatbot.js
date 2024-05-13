import React, { useEffect, useState } from 'react';

function KommunicateChat({ user, checkLogout }) {
    const [load, setLoad] = useState(false);

    const [chatbotSessionCreated, setChatbotSessionCreated] = useState(false);

    useEffect(() => {
        // Kiểm tra xem user đã được truyền vào hay không
        if (user?.id) {
            // Nếu có user và chưa có phiên chatbot, tạo một phiên mới
            setChatbotSessionCreated(false);

            if (!chatbotSessionCreated) {
                createNewKommunicateSession();
                setChatbotSessionCreated(true);
            }
        } else if (!user?.id) {

            // Nếu không có user, đăng xuất khỏi phiên Kommunicate hiện tại (nếu có)
            if (window.kommunicate) {
                window.kommunicate.logout && window.kommunicate.logout();
                window.kommunicate = null;

            }
            createNewKommunicateSession();

            // Đặt lại trạng thái để cho biết không có phiên chatbot nào tồn tại

            setChatbotSessionCreated(true);
        }
    }, [user?.id]);

    const createNewKommunicateSession = () => {
        if (!window.kommunicate) {
            (function (d, m) {
                var kommunicateSettings =
                {
                    appId: "1cc78dfeb42574f4076602d9559a22e49",
                    popupWidget: true,
                    automaticChatOpenOnNavigation: true
                };
                var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
                s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
                var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
                window.kommunicate = m; m._globals = kommunicateSettings;
            })(document, window.kommunicate || {});
        }
    };

    const deleteKommunicateSession = () => {
        // Logic xóa phiên Kommunicate (nếu cần)
        if (window.kommunicate) {
            // Nếu phiên Kommunicate đã được khởi tạo, xóa nó
            window.kommunicate.logout();
            window.kommunicate = null; // Xóa đối tượng Kommunicate khỏi global namespace
        }
    };

    return (
        <div>
            {/* Nội dung của thành phần */}
        </div>
    );
}

export default KommunicateChat;
