// api.tsx — defensive, explicit endpoints
const ROOT_BASE = "http://localhost:5000";
const HR_BASE = `${ROOT_BASE}/api/hr`; // use for payroll endpoints that live under /api/hr

export const getStoredEmployeeId = (): number | null => {
  const id = localStorage.getItem("employee_id");
  return id ? parseInt(id, 10) : null;
};

export const setStoredEmployeeId = (id: number): void => {
  localStorage.setItem("employee_id", id.toString());
};

export const clearStoredEmployeeId = (): void => {
  localStorage.removeItem("employee_id");
};

// Try to parse JSON safely — if it fails, return a consistent error object
async function safeJsonResponse(resp: Response) {
  let text: string;
  try {
    // read as text first so we can give a helpful message
    text = await resp.text();
    try {
      // try parse
      const parsed = JSON.parse(text);
      return parsed;
    } catch (parseErr) {
      // not valid JSON
      return { success: false, message: `Invalid JSON from server (status ${resp.status})`, raw: text };
    }
  } catch (err) {
    return { success: false, message: "Failed to read response from server" };
  }
}

export const api = {
  // HR login (root path)
  hrLogin: async (employee_ID: number, password: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/hr-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ employee_ID, password }),
      });

      const json = await safeJsonResponse(response);
      // If non-OK and server returned a JSON-like object, surface its message
      if (!response.ok) {
        return { success: false, message: json?.message || `HTTP ${response.status}` };
      }
      // Otherwise return whatever the server returned
      return json;
    } catch (err: any) {
      console.error("hrLogin error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Get pending leaves – requires hrId
  getPendingLeaves: async (hrId: number) => {
    try {
      // server route (your server previously used /pending-leaves at root)
      const url = `${ROOT_BASE}/pending-leaves?hrId=${encodeURIComponent(hrId)}`;

      const response = await fetch(url, { method: "GET" });
      const json = await safeJsonResponse(response);

      if (!response.ok) {
        return { success: false, message: json?.message || `HTTP ${response.status}`, data: [] };
      }

      // If server returned wrapped { success: true, data: [...] } we forward data,
      // otherwise we assume the body itself is the data array/object.
      if (json && typeof json === "object" && "success" in json) {
        return { success: json.success, message: json.message, data: json.data ?? [] };
      } else {
        return { success: true, data: json ?? [] };
      }
    } catch (err: any) {
      console.error("getPendingLeaves error:", err);
      return { success: false, message: `Network error: ${err.message || err}`, data: [] };
    }
  },

  // Approve endpoints — these use HR_BASE only if you implemented them under /api/hr, but
  // default to ROOT paths. Adjust server if needed.
  approveAnnualLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-annual-accidental`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveAnnualLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  approveUnpaidLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-unpaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveUnpaidLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  approveCompensationLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      const response = await fetch(`${ROOT_BASE}/approve-compensation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("approveCompensationLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Generic processLeave: selects endpoint by type then calls it
  processLeave: async (requestId: number, hrId: number, leaveType: string) => {
    try {
      let endpoint = "";
      switch (leaveType.toLowerCase()) {
        case "annual":
        case "accidental":
          endpoint = "/approve-annual-accidental";
          break;
        case "unpaid":
          endpoint = "/approve-unpaid";
          break;
        case "compensation":
          endpoint = "/approve-compensation";
          break;
        default:
          throw new Error("Invalid leave type");
      }

      const response = await fetch(`${ROOT_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request_ID: requestId, HR_ID: hrId, leave_type: leaveType }),
      });

      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("processLeave error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Deductions (assume routes are at root; change to HR_BASE if your server defines them under /api/hr)
  deductHours: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-hours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductHours error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  deductDays: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-days`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductDays error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  deductUnpaid: async (employee_ID: number) => {
    try {
      const response = await fetch(`${ROOT_BASE}/deduction-unpaid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("deductUnpaid error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },

  // Payroll — your server used /api/hr/generate-payroll in earlier snippet, so call HR_BASE here.
  generatePayroll: async (employee_ID: number, from_date: string, to_date: string) => {
    try {
      const response = await fetch(`${HR_BASE}/generate-payroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employee_ID, from_date, to_date }),
      });
      const json = await safeJsonResponse(response);
      if (!response.ok) return { success: false, message: json?.message || `HTTP ${response.status}` };
      return json;
    } catch (err: any) {
      console.error("generatePayroll error:", err);
      return { success: false, message: `Network error: ${err.message || err}` };
    }
  },
};
