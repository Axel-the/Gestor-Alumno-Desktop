const API_URL = 'https://script.google.com/macros/s/AKfycbw_Ga6a_aU9wKCdWTJCIxMP8-TYDlJ9t8qt3BFkZkjUF3RqsOd2CnpJlFst8unnm5cdiA/exec';

export const studentService = {
    async getStudents() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error fetching students');
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async createStudent(studentData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'create',
                    ...studentData
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async updateStudent(studentData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'update',
                    ...studentData
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async deleteStudent(nombres, apellidos) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                redirect: 'follow',
                body: JSON.stringify({
                    action: 'delete',
                    nombres,
                    apellidos
                })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};
