'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { Lead } from '@/types';
import { FiUsers, FiRefreshCw, FiFilter, FiSearch, FiPlus, FiX, FiZap, FiUpload, FiFile } from 'react-icons/fi';

export default function LeadsPage() {
  // CRITICAL: Initialize from localStorage if available (for immediate display on refresh)
  const getInitialLeads = (): Lead[] => {
    try {
      const saved = localStorage.getItem('leads_cache');
      if (saved) {
        const cached = JSON.parse(saved);
        if (Array.isArray(cached) && cached.length > 0) {
          console.log(`[Leads] Initializing with ${cached.length} cached leads from localStorage`);
          return cached;
        }
      }
    } catch (e) {
      console.error('[Leads] Error loading initial leads from localStorage:', e);
    }
    return [];
  };
  
  const [leads, setLeads] = useState<Lead[]>(getInitialLeads);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [syncing, setSyncing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website',
    notes: ''
  });
  const [sendFollowUp, setSendFollowUp] = useState(false);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<any[]>([]);
  const [uploadResult, setUploadResult] = useState<any>(null);

  useEffect(() => {
    // CRITICAL: Load from localStorage FIRST on mount (before any fetch)
    // This ensures leads appear immediately on page refresh
    const loadCachedLeads = () => {
      try {
        const saved = localStorage.getItem('leads_cache');
        console.log('[Leads] Checking localStorage:', saved ? `Found ${saved.length} chars` : 'Empty');
        if (saved) {
          const cachedLeads = JSON.parse(saved);
          if (Array.isArray(cachedLeads) && cachedLeads.length > 0) {
            console.log(`[Leads] ✅ Loading ${cachedLeads.length} cached leads from localStorage`);
            setLeads(cachedLeads); // Show cached leads immediately
            return true;
          } else {
            console.log('[Leads] ⚠️ Cached data is not a valid array or is empty');
          }
        } else {
          console.log('[Leads] ⚠️ No cached leads found in localStorage');
        }
      } catch (e) {
        console.error('[Leads] ❌ Error loading from localStorage:', e);
      }
      return false;
    };
    
    // Load cached leads immediately
    const hasCache = loadCachedLeads();
    
    // Then fetch fresh data from server (in background)
    // Use a small delay if we have cache to let UI render first
    if (hasCache) {
      setTimeout(() => fetchLeads(), 100);
    } else {
      fetchLeads();
    }
    
    // Also refetch when user returns to this tab (handles tab switching)
    // BUT: Don't clear leads if fetch fails - preserve what we have
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // User switched back to this tab
        // First ensure we have cached leads visible
        try {
          const saved = localStorage.getItem('leads_cache');
          if (saved) {
            const cachedLeads = JSON.parse(saved);
            if (Array.isArray(cachedLeads) && cachedLeads.length > 0) {
              setLeads(cachedLeads); // Show cached leads immediately
            }
          }
        } catch (e) {
          // Ignore
        }
        // Then refresh in background (won't clear if it fails)
        fetchLeads();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also listen for window focus (when switching browser tabs)
    const handleFocus = () => {
      // Same as above - show cached first, then refresh
      try {
        const saved = localStorage.getItem('leads_cache');
        if (saved) {
          const cachedLeads = JSON.parse(saved);
          if (Array.isArray(cachedLeads) && cachedLeads.length > 0) {
            setLeads(cachedLeads);
          }
        }
      } catch (e) {
        // Ignore
      }
      fetchLeads();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchLeads = async (): Promise<Lead[]> => {
    // CRITICAL: Load from localStorage FIRST before doing anything
    // This ensures we always have leads even if fetch fails
    let currentLeads: Lead[] = [];
    try {
      const saved = localStorage.getItem('leads_cache');
      if (saved) {
        currentLeads = JSON.parse(saved);
        if (Array.isArray(currentLeads) && currentLeads.length > 0) {
          // Restore from cache immediately - don't wait for fetch
          setLeads(currentLeads);
          console.log(`[Leads] Restored ${currentLeads.length} leads from localStorage before fetch`);
        }
      }
    } catch (e) {
      console.error('[Leads] Error loading from localStorage:', e);
    }
    
    // Also get from state (in case localStorage is empty but state has data)
    setLeads(prev => {
      if (prev.length > 0 && currentLeads.length === 0) {
        currentLeads = prev;
      }
      return prev;
    });
    
    setLoading(true);
    setError('');
    
    try {
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timeout: Backend server may not be running. Please check if the server is running at http://localhost:8000'));
        }, 8000);
      });
      
      const data = await Promise.race([
        api.getLeads(), // Fetch all leads for the leads page (no limit)
        timeoutPromise
      ]) as any;
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        // Normalize the data structure (handle both snake_case and camelCase)
        const normalizedLeads: Lead[] = data.map((lead: any) => ({
          id: String(lead.id || lead.pk),
          name: lead.name,
          email: lead.email,
          phone: lead.phone || '',
          status: (lead.status || 'new') as Lead['status'],
          source: lead.source || '',
          createdAt: lead.created_at || lead.createdAt || new Date().toISOString(),
          lastContacted: lead.last_contacted || lead.lastContacted,
          notes: lead.notes,
          serviceType: lead.service_type || lead.serviceType,
          price: lead.price ? parseFloat(String(lead.price)) : undefined,
          descriptionOfEnquiry: lead.description_of_enquiry || lead.descriptionOfEnquiry,
          potentialValue: lead.potential_value || lead.potentialValue ? parseFloat(String(lead.potential_value || lead.potentialValue)) : undefined
        }));
        
        // CRITICAL: Save to localStorage BEFORE updating state
        // This ensures data is persisted even if component unmounts
        try {
          const jsonString = JSON.stringify(normalizedLeads);
          localStorage.setItem('leads_cache', jsonString);
          console.log(`[Leads] ✅ Saved ${normalizedLeads.length} leads to localStorage (${jsonString.length} chars)`);
          
          // Verify it was saved
          const verify = localStorage.getItem('leads_cache');
          if (verify && verify.length > 0) {
            console.log(`[Leads] ✅ Verified: localStorage contains ${verify.length} chars`);
          } else {
            console.error('[Leads] ❌ ERROR: localStorage save failed - data not found after save!');
          }
        } catch (e) {
          console.error('[Leads] ❌ Error saving to localStorage:', e);
          // Even if save fails, still update state
        }
        
        // Update state AFTER saving to localStorage
        setLeads(normalizedLeads);
        return normalizedLeads;
      } else if (data && data.error) {
        // If API returned an error object, throw it
        throw new Error(data.error || 'Failed to load leads');
      } else {
        // If data is not an array and not an error, keep current leads
        if (currentLeads.length > 0) {
          return currentLeads;
        }
        setLeads([]);
        return [];
      }
    } catch (err: any) {
      console.error('[Leads] Error fetching leads:', err);
      setError(err.message || 'Failed to load leads');
      
      // CRITICAL: NEVER clear leads on error - always preserve existing ones
      // This prevents leads from "disappearing" on refresh or if backend is temporarily down
      
      // If we have current leads (from localStorage or state), keep them
      if (currentLeads.length > 0) {
        console.log(`[Leads] Preserving ${currentLeads.length} leads after fetch error`);
        // Make sure they're still in state
        setLeads(currentLeads);
        return currentLeads;
      }
      
      // Last resort: try localStorage one more time
      try {
        const saved = localStorage.getItem('leads_cache');
        if (saved) {
          const cachedLeads = JSON.parse(saved);
          if (Array.isArray(cachedLeads) && cachedLeads.length > 0) {
            console.log(`[Leads] Restored ${cachedLeads.length} leads from localStorage after error`);
            setLeads(cachedLeads);
            return cachedLeads;
          }
        }
      } catch (e) {
        console.error('[Leads] Error loading from localStorage after error:', e);
      }
      
      // Only if we have absolutely no leads anywhere, show empty
      // But don't actively clear - just leave what we have
      console.warn('[Leads] No leads found in cache or state after error');
      return currentLeads; // Return whatever we have (might be empty)
    } finally {
      setLoading(false);
    }
  };

  const handleSyncCRM = async () => {
    setSyncing(true);
    try {
      await api.syncCRM();
      // Refresh leads after sync
      await fetchLeads();
      alert('CRM synced successfully!');
    } catch (err: any) {
      console.error('Error syncing CRM:', err);
      alert('Failed to sync CRM: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('[Upload] File input changed, file:', file);
    console.log('[Upload] Files array:', e.target.files);
    console.log('[Upload] Files length:', e.target.files?.length);
    
    if (!file) {
      console.log('[Upload] No file selected');
      setUploadFile(null);
      setUploadPreview([]);
      setError('');
      return;
    }
    
    // Check file type - be more lenient with file extensions
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    // Also check MIME type as fallback
    const validMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    console.log('[Upload] File extension:', fileExtension);
    console.log('[Upload] File name:', file.name);
    console.log('[Upload] File size:', file.size);
    console.log('[Upload] File type:', file.type);
    
    const isValidExtension = validExtensions.includes(fileExtension);
    const isValidMimeType = file.type && validMimeTypes.some(mime => file.type.includes(mime.split('/')[1]));
    
    if (!isValidExtension && !isValidMimeType) {
      const errorMsg = `Invalid file type. Please select a CSV or Excel file.\n\nSelected: ${file.name}\nType: ${file.type || 'unknown'}\nExtension: ${fileExtension}`;
      console.error('[Upload]', errorMsg);
      alert(errorMsg);
      setUploadFile(null);
      setUploadPreview([]);
      setError('Invalid file type');
      // Reset input
      e.target.value = '';
      return;
    }
    
    console.log('[Upload] File is valid, setting upload file');
    setUploadFile(file);
    setUploadResult(null);
    setError('');
    
    // Preview file
    if (file.name.toLowerCase().endsWith('.csv')) {
      console.log('[Upload] Reading CSV file for preview');
      // Preview CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        console.log('[Upload] CSV content length:', text.length);
        const lines = text.split('\n').filter(line => line.trim()).slice(0, 11); // First 10 rows + header
        console.log('[Upload] Preview lines:', lines.length);
        const preview = lines.map((line, idx) => {
          if (idx === 0) {
            // Header row
            const headers = line.split(',').map(h => h.trim());
            return {
              name: headers[0] || 'Name',
              email: headers[1] || 'Email',
              phone: headers[2] || 'Phone',
              source: headers[3] || 'Source'
            };
          }
          const values = line.split(',').map(v => v.trim());
          return {
            name: values[0] || '',
            email: values[1] || '',
            phone: values[2] || '',
            source: values[3] || ''
          };
        });
        console.log('[Upload] Setting preview:', preview.length, 'rows');
        setUploadPreview(preview);
      };
      reader.onerror = () => {
        console.error('[Upload] Error reading file');
        setUploadPreview([]);
      };
      reader.readAsText(file);
    } else {
      // For Excel files, just show file name (preview would require a library)
      console.log('[Upload] Excel file selected, showing file info');
      setUploadPreview([{
        name: 'Excel file selected',
        email: file.name,
        phone: `File size: ${(file.size / 1024).toFixed(2)} KB`,
        source: 'Preview available after upload'
      }]);
    }
  };

  const handleUploadLeads = async () => {
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }

    console.log('[Upload] Starting upload for file:', uploadFile.name, 'Size:', uploadFile.size);
    setUploading(true);
    setUploadResult(null);
    
    try {
      console.log('[Upload] Calling API...');
      const result = await api.uploadLeadsCSV(uploadFile);
      console.log('[Upload] API response:', result);
      
      setUploadResult(result);
      
      if (result.success) {
        // Refresh leads list
        console.log('[Upload] Upload successful, refreshing leads...');
        await fetchLeads();
        
        // Show success message
        alert(`✅ Import completed!\n\nCreated: ${result.stats.created}\nUpdated: ${result.stats.updated}\nSkipped: ${result.stats.skipped}`);
        
        // Close modal after a delay
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadFile(null);
          setUploadPreview([]);
          setUploadResult(null);
          // Reset file input
          const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        }, 3000);
      } else {
        console.error('[Upload] Upload failed:', result.error);
        alert('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('[Upload] Error uploading leads:', err);
      alert('Failed to upload leads: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateFollowUp = async () => {
    if (!newLead.name || !newLead.email) {
      alert('Please fill in name and email first');
      return;
    }

    setGeneratingAI(true);
    try {
      const prompt = `Write a professional follow-up email to ${newLead.name} (${newLead.email}). ${newLead.notes ? `Context: ${newLead.notes}` : 'Welcome them and express interest in helping.'}`;
      
      const response = await api.generateAIResponse(prompt, {
        lead: {
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone || undefined,
          source: newLead.source || undefined,
          notes: newLead.notes || undefined
        },
        conversationHistory: []
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setFollowUpMessage(response.response || '');
    } catch (err: any) {
      console.error('Error generating AI message:', err);
      alert('Failed to generate AI message: ' + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleCreateLead = async () => {
    if (!newLead.name || !newLead.email) {
      alert('Please fill in name and email');
      return;
    }

    setCreating(true);
    try {
      // Create the lead
      const createdLead = await api.createLead({
        name: newLead.name,
        email: newLead.email,
        phone: newLead.phone || undefined,
        status: 'new',
        source: newLead.source,
        notes: newLead.notes
      });

      // Send follow-up email if requested
      if (sendFollowUp && followUpMessage.trim()) {
        try {
          await api.sendMessage({
            leadId: String(createdLead.id),
            channel: 'email',
            content: followUpMessage
          });
        } catch (emailErr: any) {
          // Don't fail the whole operation if email fails
          alert('Lead created but follow-up email failed: ' + emailErr.message);
        }
      }
      
      // Add the new lead to the list immediately (optimistic update)
      // Handle both snake_case and camelCase from backend
      const newLeadData: Lead = {
        id: String(createdLead.id || createdLead.pk),
        name: createdLead.name,
        email: createdLead.email,
        phone: createdLead.phone || '',
        status: (createdLead.status || 'new') as Lead['status'],
        source: createdLead.source || newLead.source || 'Website',
        createdAt: createdLead.created_at || createdLead.createdAt || new Date().toISOString(),
        notes: createdLead.notes || newLead.notes,
        serviceType: createdLead.service_type || createdLead.serviceType,
        price: createdLead.price ? parseFloat(String(createdLead.price)) : undefined,
        descriptionOfEnquiry: createdLead.description_of_enquiry || createdLead.descriptionOfEnquiry,
        potentialValue: createdLead.potential_value || createdLead.potentialValue ? parseFloat(String(createdLead.potential_value || createdLead.potentialValue)) : undefined
      };
      
      // Add to the beginning of the list so it appears at the top
      setLeads(prevLeads => {
        // Check if lead already exists (avoid duplicates)
        const exists = prevLeads.some(l => l.id === newLeadData.id || (l.email === newLeadData.email && l.name === newLeadData.name));
        if (exists) {
          return prevLeads; // Don't add duplicate
        }
        const updatedLeads = [newLeadData, ...prevLeads];
        // CRITICAL: Save to localStorage immediately for persistence
        try {
          localStorage.setItem('leads_cache', JSON.stringify(updatedLeads));
          console.log(`[Leads] Saved ${updatedLeads.length} leads to localStorage after creating new lead`);
        } catch (e) {
          console.error('[Leads] Error saving to localStorage:', e);
        }
        return updatedLeads;
      });
      
      // Reset form
      setNewLead({ name: '', email: '', phone: '', source: 'Website', notes: '' });
      setFollowUpMessage('');
      setSendFollowUp(false);
      setShowCreateModal(false);
      
      // Refresh in background to get full data, but preserve the new lead
      setTimeout(() => {
        fetchLeads().then((refreshedLeads) => {
          // Merge: keep the new lead if it's not in refreshed list yet
          setLeads((currentLeads) => {
            const newLeadId = newLeadData.id;
            const refreshedHasNewLead = refreshedLeads.some((l: Lead) => String(l.id) === newLeadId);
            
            let finalLeads: Lead[];
            if (refreshedHasNewLead) {
              // Use refreshed data (more complete) - it should include our new lead
              finalLeads = refreshedLeads;
            } else {
              // Keep new lead at top, then add refreshed leads
              const otherLeads = refreshedLeads.filter((l: Lead) => String(l.id) !== newLeadId);
              finalLeads = [newLeadData, ...otherLeads];
            }
            // Save to localStorage
            try {
              localStorage.setItem('leads_cache', JSON.stringify(finalLeads));
            } catch (e) {
              // Ignore localStorage errors
            }
            return finalLeads;
          });
        }).catch(() => {
          // If refresh fails, keep the optimistic update - lead is already visible
        });
      }, 500); // Small delay to ensure backend has processed
      
      alert(`Lead "${createdLead.name}" created successfully!${sendFollowUp ? ' Follow-up email sent.' : ' Welcome email will be sent automatically.'}`);
    } catch (err: any) {
      console.error('Error creating lead:', err);
      alert('Failed to create lead: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const filteredLeads = Array.isArray(leads) ? leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.descriptionOfEnquiry && lead.descriptionOfEnquiry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    // Handle service type filter (check both camelCase and snake_case)
    const leadServiceType = (lead as any).serviceType || (lead as any).service_type;
    const matchesServiceType = serviceTypeFilter === 'all' || leadServiceType === serviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesServiceType;
  }) : [];

  const statusCounts = {
    all: Array.isArray(leads) ? leads.length : 0,
    new: Array.isArray(leads) ? leads.filter(l => l.status === 'new').length : 0,
    contacted: Array.isArray(leads) ? leads.filter(l => l.status === 'contacted').length : 0,
    qualified: Array.isArray(leads) ? leads.filter(l => l.status === 'qualified').length : 0,
    converted: Array.isArray(leads) ? leads.filter(l => l.status === 'converted').length : 0,
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600 mt-1">
              Manage your leads from CRM and other sources
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Create Lead</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FiUpload className="w-4 h-4" />
              <span>Upload Leads</span>
            </button>
            <button
              onClick={handleSyncCRM}
              disabled={syncing}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync CRM'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.all}</p>
              </div>
              <FiUsers className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.new}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.contacted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.qualified}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{statusCounts.converted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
            </div>
            {/* Service Type Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Service Types</option>
                <option value="consultation">Consultation</option>
                <option value="coaching">Coaching</option>
                <option value="therapy">Therapy</option>
                <option value="session">Session</option>
                <option value="workshop">Workshop</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-500 mb-4">
                  {leads.length === 0 
                    ? 'No leads yet. Sync your CRM to import leads from SimplyBook.me'
                    : 'No leads match your search criteria'}
                </p>
                {leads.length === 0 && (
                  <button
                    onClick={handleSyncCRM}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Sync CRM Now
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Potential Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => {
                    const serviceType = (lead as any).serviceType || (lead as any).service_type || 'N/A';
                    const price = (lead as any).price || lead.price;
                    const potentialValue = (lead as any).potentialValue || (lead as any).potential_value || lead.potentialValue;
                    const description = (lead as any).descriptionOfEnquiry || (lead as any).description_of_enquiry || lead.descriptionOfEnquiry;
                    
                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => window.location.href = `/leads/${lead.id}`}
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          {description && (
                            <div className="text-xs text-gray-400 mt-1 truncate max-w-xs" title={description}>
                              {description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {serviceType !== 'N/A' ? serviceType : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {price ? `$${parseFloat(price).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {potentialValue ? `$${parseFloat(potentialValue).toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Lead</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={newLead.source}
                  onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook Ads">Facebook Ads</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Email Campaign">Email Campaign</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes about this lead..."
                />
              </div>

              {/* Follow-up Email Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="checkbox"
                    id="sendFollowUp"
                    checked={sendFollowUp}
                    onChange={(e) => setSendFollowUp(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="sendFollowUp" className="text-sm font-medium text-gray-700">
                    Send follow-up email immediately
                  </label>
                </div>

                {sendFollowUp && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={handleGenerateFollowUp}
                        disabled={generatingAI || !newLead.name || !newLead.email}
                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {generatingAI ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <FiZap className="w-4 h-4" />
                            <span>AI Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={followUpMessage}
                      onChange={(e) => setFollowUpMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={4}
                      placeholder="Enter your follow-up email message here, or click 'AI Generate' to create one automatically..."
                    />
                    <p className="text-xs text-gray-500">
                      This email will be sent immediately when you create the lead (in addition to the automatic welcome email).
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLead}
                disabled={creating || !newLead.name || !newLead.email}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Lead'}
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              💡 AI will automatically send a welcome email when you create this lead!
            </p>
          </div>
        </div>
      )}

      {/* Upload Leads Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Upload Leads from CSV</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                    setUploadPreview([]);
                    setUploadResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* File Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CSV or Excel File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                      onChange={(e) => {
                        console.log('[Upload] INPUT onChange triggered!', e);
                        console.log('[Upload] Event target:', e.target);
                        console.log('[Upload] Files:', e.target.files);
                        handleFileSelect(e);
                      }}
                      onClick={(e) => {
                        console.log('[Upload] INPUT clicked');
                      }}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      onClick={(e) => {
                        console.log('[Upload] Label clicked, triggering file input');
                        const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                        if (fileInput) {
                          console.log('[Upload] File input found, clicking it');
                          fileInput.click();
                        } else {
                          console.error('[Upload] File input NOT found!');
                        }
                      }}
                      className="cursor-pointer flex flex-col items-center hover:bg-gray-50 transition-colors rounded-lg p-2"
                    >
                      <FiFile className={`w-12 h-12 mb-2 ${uploadFile ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">
                        {uploadFile ? (
                          <>
                            <span className="text-green-600">✓ {uploadFile.name}</span>
                            <span className="block text-xs text-gray-500 mt-1">
                              {(uploadFile.size / 1024).toFixed(2)} KB • Ready to upload
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-gray-600">Click to select CSV or Excel file</span>
                            <span className="block text-xs text-gray-500 mt-1">
                              CSV or Excel files (.csv, .xlsx, .xls)
                            </span>
                          </>
                        )}
                      </span>
                      {uploadFile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setUploadFile(null);
                            setUploadPreview([]);
                            const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                            if (fileInput) {
                              fileInput.value = '';
                            }
                          }}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                        >
                          Remove file
                        </button>
                      )}
                    </label>
                  </div>
                </div>

                {/* File Status Indicator */}
                {uploadFile ? (
                  <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-green-600 text-2xl">✓</span>
                        <div>
                          <p className="text-sm font-semibold text-green-900">File Ready to Upload</p>
                          <p className="text-xs text-green-700">{uploadFile.name}</p>
                          <p className="text-xs text-green-600">Size: {(uploadFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setUploadFile(null);
                          setUploadPreview([]);
                          const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                          if (fileInput) {
                            fileInput.value = '';
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 flex items-center space-x-2">
                      <span>⚠️</span>
                      <span><strong>No file selected.</strong> Click the upload area above to select a file.</span>
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      💡 Tip: Check browser console (F12) for debugging messages when you click.
                    </p>
                  </div>
                )}

                {/* File Format Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">File Format Requirements:</h3>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✅ <strong>Supported formats:</strong> CSV (.csv), Excel (.xlsx, .xls)</li>
                    <li>✅ <strong>Required columns:</strong> Name, Email</li>
                    <li>✅ <strong>Optional columns:</strong> Phone, Source, Status, Service Type, Notes, Price, Potential Value, Description of Enquiry</li>
                    <li>✅ First row should be headers</li>
                    <li>✅ Duplicate emails will update existing leads</li>
                  </ul>
                </div>

                {/* Preview */}
                {uploadPreview.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Preview (First {Math.min(uploadPreview.length, 10)} rows):
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Email</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Phone</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Source</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {uploadPreview.slice(0, 10).map((row: any, idx: number) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 text-sm text-gray-900">{row.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-900">{row.email}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{row.phone || '-'}</td>
                              <td className="px-4 py-2 text-sm text-gray-500">{row.source || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">❌ Upload Error</h3>
                    <p className="text-sm text-red-800">{error}</p>
                    <p className="text-xs text-red-600 mt-2">Please check the browser console (F12) for more details.</p>
                  </div>
                )}

                {/* Upload Result */}
                {uploadResult && (
                  <div className={`border rounded-lg p-4 ${
                    uploadResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      uploadResult.success ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {uploadResult.success ? '✅ Upload Successful!' : '❌ Upload Failed'}
                    </h3>
                    {uploadResult.stats && (
                      <div className="text-sm space-y-1">
                        <p>Created: {uploadResult.stats.created}</p>
                        <p>Updated: {uploadResult.stats.updated}</p>
                        <p>Skipped: {uploadResult.stats.skipped}</p>
                        {uploadResult.errors && uploadResult.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium">Errors:</p>
                            <ul className="list-disc list-inside text-xs">
                              {uploadResult.errors.slice(0, 5).map((err: string, idx: number) => (
                                <li key={idx}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadFile(null);
                      setUploadPreview([]);
                      setUploadResult(null);
                      // Reset file input
                      const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = '';
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('[Upload] Import button clicked, uploadFile:', uploadFile);
                      if (!uploadFile) {
                        alert('Please select a file first');
                        return;
                      }
                      handleUploadLeads();
                    }}
                    disabled={!uploadFile || uploading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    title={!uploadFile ? 'Please select a file first' : 'Click to upload selected file'}
                  >
                    {uploading ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FiUpload className="w-4 h-4" />
                        <span>Import Leads {uploadFile ? `(${uploadFile.name})` : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

