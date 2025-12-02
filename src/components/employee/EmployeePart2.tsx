import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '../../utils/api.tsx';

interface EmployeePart2Props {
  userId: number;
  user: any;
}

export function EmployeePart2({ userId, user }: EmployeePart2Props) {
  const [activeSection, setActiveSection] = useState('accidental-leave');
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [accidentalLeaveForm, setAccidentalLeaveForm] = useState({ start_date: '', end_date: '' });
  const [medicalLeaveForm, setMedicalLeaveForm] = useState({
    start_date: '',
    end_date: '',
    type: 'sick',
    insurance_status: 'yes',
    disability_details: '',
    document_description: '',
    file_name: ''
  });
  const [unpaidLeaveForm, setUnpaidLeaveForm] = useState({
    start_date: '',
    end_date: '',
    document_description: '',
    file_name: ''
  });
  const [compensationLeaveForm, setCompensationLeaveForm] = useState({
    compensation_date: '',
    reason: '',
    date_of_original_workday: '',
    replacement_emp: ''
  });
  const [evaluationForm, setEvaluationForm] = useState({
    employee_ID: '',
    rating: '5',
    comments: '',
    semester: ''
  });

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const result = await api.getPendingApprovals(userId);
      setPendingApprovals(result.data);
      toast.success('Pending approvals loaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const submitAccidentalLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitAccidentalLeave(userId, accidentalLeaveForm.start_date, accidentalLeaveForm.end_date);
      toast.success(result.message);
      setAccidentalLeaveForm({ start_date: '', end_date: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit accidental leave');
    } finally {
      setLoading(false);
    }
  };

  const submitMedicalLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitMedicalLeave({ employee_ID: userId, ...medicalLeaveForm });
      toast.success(result.message);
      setMedicalLeaveForm({
        start_date: '',
        end_date: '',
        type: 'sick',
        insurance_status: 'yes',
        disability_details: '',
        document_description: '',
        file_name: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit medical leave');
    } finally {
      setLoading(false);
    }
  };

  const submitUnpaidLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitUnpaidLeave({ employee_ID: userId, ...unpaidLeaveForm });
      toast.success(result.message);
      setUnpaidLeaveForm({ start_date: '', end_date: '', document_description: '', file_name: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit unpaid leave');
    } finally {
      setLoading(false);
    }
  };

  const submitCompensationLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitCompensationLeave({ employee_ID: userId, ...compensationLeaveForm, replacement_emp: compensationLeaveForm.replacement_emp ? parseInt(compensationLeaveForm.replacement_emp) : null });
      toast.success(result.message);
      setCompensationLeaveForm({ compensation_date: '', reason: '', date_of_original_workday: '', replacement_emp: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit compensation leave');
    } finally {
      setLoading(false);
    }
  };

  const approveLeave = async (leaveId: number, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const result = await api.approveLeave(userId, leaveId, status);
      toast.success(result.message);
      fetchPendingApprovals();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process leave approval');
    } finally {
      setLoading(false);
    }
  };

  const submitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.submitEvaluation({ evaluator_ID: userId, ...evaluationForm, employee_ID: parseInt(evaluationForm.employee_ID), rating: parseInt(evaluationForm.rating) });
      toast.success(result.message);
      setEvaluationForm({ employee_ID: '', rating: '5', comments: '', semester: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit evaluation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'approvals') {
      fetchPendingApprovals();
    }
  }, [activeSection]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => setActiveSection('accidental-leave')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'accidental-leave' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Accidental Leave</div>
        </button>
        <button onClick={() => setActiveSection('medical-leave')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'medical-leave' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Medical Leave</div>
        </button>
        <button onClick={() => setActiveSection('unpaid-leave')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'unpaid-leave' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Unpaid Leave</div>
        </button>
        <button onClick={() => setActiveSection('compensation-leave')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'compensation-leave' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Compensation Leave</div>
        </button>
        <button onClick={() => setActiveSection('approvals')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'approvals' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Approve Leaves</div>
        </button>
        <button onClick={() => setActiveSection('evaluation')} className={`p-4 rounded-lg border-2 transition-all ${activeSection === 'evaluation' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
          <div className="text-sm">Evaluate Employee</div>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeSection === 'accidental-leave' && (
          <div>
            <h3 className="text-gray-900 mb-4">Apply for Accidental Leave</h3>
            <form onSubmit={submitAccidentalLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Start Date (must be requested within 48 hours)</label>
                <input type="date" value={accidentalLeaveForm.start_date} onChange={(e) => setAccidentalLeaveForm({ ...accidentalLeaveForm, start_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <input type="date" value={accidentalLeaveForm.end_date} onChange={(e) => setAccidentalLeaveForm({ ...accidentalLeaveForm, end_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Accidental Leave'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'medical-leave' && (
          <div>
            <h3 className="text-gray-900 mb-4">Apply for Medical Leave</h3>
            <form onSubmit={submitMedicalLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input type="date" value={medicalLeaveForm.start_date} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, start_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <input type="date" value={medicalLeaveForm.end_date} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, end_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <select value={medicalLeaveForm.type} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, type: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="sick">Sick</option>
                  <option value="maternity">Maternity</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Insurance Valid?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="insurance" checked={medicalLeaveForm.insurance_status === 'yes'} onChange={() => setMedicalLeaveForm({ ...medicalLeaveForm, insurance_status: 'yes' })} className="" />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="insurance" checked={medicalLeaveForm.insurance_status === 'no'} onChange={() => setMedicalLeaveForm({ ...medicalLeaveForm, insurance_status: 'no' })} className="" />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Disability Details (if any)</label>
                <input type="text" value={medicalLeaveForm.disability_details} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, disability_details: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Document Description</label>
                <input type="text" value={medicalLeaveForm.document_description} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, document_description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">File Name</label>
                <input type="text" value={medicalLeaveForm.file_name} onChange={(e) => setMedicalLeaveForm({ ...medicalLeaveForm, file_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Medical Leave'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'unpaid-leave' && (
          <div>
            <h3 className="text-gray-900 mb-4">Apply for Unpaid Leave</h3>
            <form onSubmit={submitUnpaidLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Start Date</label>
                <input type="date" value={unpaidLeaveForm.start_date} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, start_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">End Date</label>
                <input type="date" value={unpaidLeaveForm.end_date} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, end_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Document Description (Memo)</label>
                <input type="text" value={unpaidLeaveForm.document_description} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, document_description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">File Name</label>
                <input type="text" value={unpaidLeaveForm.file_name} onChange={(e) => setUnpaidLeaveForm({ ...unpaidLeaveForm, file_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Unpaid Leave'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'compensation-leave' && (
          <div>
            <h3 className="text-gray-900 mb-4">Apply for Compensation Leave</h3>
            <form onSubmit={submitCompensationLeave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Compensation Date</label>
                <input type="date" value={compensationLeaveForm.compensation_date} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, compensation_date: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date of Original Workday</label>
                <input type="date" value={compensationLeaveForm.date_of_original_workday} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, date_of_original_workday: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Reason</label>
                <input type="text" value={compensationLeaveForm.reason} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, reason: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Replacement Employee ID</label>
                <input type="number" value={compensationLeaveForm.replacement_emp} onChange={(e) => setCompensationLeaveForm({ ...compensationLeaveForm, replacement_emp: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Compensation Leave'}
              </button>
            </form>
          </div>
        )}

        {activeSection === 'approvals' && (
          <div>
            <h3 className="text-gray-900 mb-4">Pending Leave Approvals</h3>
            <p className="text-gray-600 text-sm mb-4">As a Dean/Vice-dean/President, you can approve or reject leave requests</p>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : pendingApprovals.length === 0 ? (
              <p className="text-gray-600">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={`${approval.Emp1_ID}-${approval.Leave_ID}`} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900">{approval.leaveType} - Request #{approval.Leave_ID}</p>
                        <p className="text-gray-600 text-sm">Requested by: {approval.requestor}</p>
                        <p className="text-gray-600 text-sm">Period: {approval.leave.start_date} to {approval.leave.end_date}</p>
                        <p className="text-gray-600 text-sm">Days: {approval.leave.num_days}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => approveLeave(approval.Leave_ID, 'approved')} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                          Approve
                        </button>
                        <button onClick={() => approveLeave(approval.Leave_ID, 'rejected')} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'evaluation' && (
          <div>
            <h3 className="text-gray-900 mb-4">Evaluate Employee (Dean Only)</h3>
            <p className="text-gray-600 text-sm mb-4">As a Dean, you can evaluate employees within your department</p>
            <form onSubmit={submitEvaluation} className="space-y-4 max-w-md">
              <div>
                <label className="block text-gray-700 mb-2">Employee ID</label>
                <input type="number" value={evaluationForm.employee_ID} onChange={(e) => setEvaluationForm({ ...evaluationForm, employee_ID: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Semester</label>
                <input type="text" placeholder="e.g., W24" value={evaluationForm.semester} onChange={(e) => setEvaluationForm({ ...evaluationForm, semester: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rating (1-5)</label>
                <select value={evaluationForm.rating} onChange={(e) => setEvaluationForm({ ...evaluationForm, rating: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Comments</label>
                <textarea value={evaluationForm.comments} onChange={(e) => setEvaluationForm({ ...evaluationForm, comments: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" rows={3} />
              </div>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Evaluation'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
