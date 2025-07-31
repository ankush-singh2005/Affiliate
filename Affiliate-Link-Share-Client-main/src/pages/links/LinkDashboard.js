import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { Modal } from "react-bootstrap";
import { usePermission } from "../../rbac/permissions";
import { useNavigate } from "react-router-dom";

function LinkDashboard() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [linksData, setLinksData] = useState([]);
    const [formData, setFormData] = useState({
        campaignTitle: "",
        originalUrl: "",
        category: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const permission = usePermission();

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [totalCount, setTotalCount] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [categories, setCategories] = useState([]);

    // Check if server endpoint is configured
    if (!serverEndpoint) {
        console.error('Server endpoint is not configured. Please check your .env file.');
    }
    //MUI DataGrid require array of fields as the sort model when using server side sorting.
    // When using client-side pagination/sorting/filter/search, MUI takes care of everything
    //abstracting the implementation details. Since we're now managing the data using server,
    // we need to manage everything and let DataGrid know what is happening.
    const [sortModel, setSortModel] = useState([
        { field: "createdAt", sort: "desc" },
    ]);

    const handleModalShow = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                campaignTitle: data.campaignTitle,
                originalUrl: data.originalUrl,
                category: data.category,
            });
        } else {
            setFormData({
                campaignTitle: "",
                originalUrl: "",
                category: "",
            });
        }
        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteModalShow = (linkId) => {
        setFormData({
            id: linkId,
        });
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(0); // Reset to first page
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0); // Reset to first page
    };

    const clearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("all");
        setCurrentPage(0);
    };

    const handleDeleteSubmit = async () => {
        try {
            await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
                withCredentials: true,
            });
            setFormData({
                campaignTitle: "",
                originalUrl: "",
                category: "",
            });
            fetchLinks();
        } catch (error) {
            setErrors({ message: "Something went wrong, please try again" });
        } finally {
            handleDeleteModalClose();
        }
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.campaignTitle.length === 0) {
            newErrors.campaignTitle = "Campaign Title is mandatory";
            isValid = false;
        }

        if (formData.originalUrl.length === 0) {
            newErrors.originalUrl = "Original URL is mandatory";
            isValid = false;
        }

        if (formData.category.length === 0) {
            newErrors.category = "Category is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                campaign_title: formData.campaignTitle,
                original_url: formData.originalUrl,
                category: formData.category,
            };
            const configuration = {
                withCredentials: true,
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/links/${formData.id}`,
                        body,
                        configuration
                    );
                } else {
                    await axios.post(
                        `${serverEndpoint}/links`,
                        body,
                        configuration
                    );
                }

                setFormData({
                    campaignTitle: "",
                    originalUrl: "",
                    category: "",
                });
                fetchLinks();
                fetchCategories(); // Refresh categories list
            } catch (error) {
                if (error.response?.data?.code === "INSUFFICIENT_FUNDS") {
                    setErrors({
                        message: `You do not have enough credits to perform this action.
                        Add funds to your account using Manage Payment option`,
                    });
                } else {
                    setErrors({
                        message: "Something went wrong, please try again",
                    });
                }
            } finally {
                handleModalClose();
            }
        }
    };

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links/categories`, {
                withCredentials: true,
            });
            setCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }, []);

    const fetchLinks = useCallback(async () => {
        try {
            setLoading(true);
            setErrors({}); // Clear previous errors

            const sortField = sortModel[0]?.field || "createdAt";
            const sortOrder = sortModel[0]?.sort || "desc";
            const params = {
                currentPage: currentPage,
                pageSize: pageSize,
                searchTerm: searchTerm,
                sortField: sortField,
                sortOrder: sortOrder,
                categoryFilter: categoryFilter,
            };

            console.log('Fetching links with params:', params);
            console.log('Server endpoint:', serverEndpoint);

            const response = await axios.get(`${serverEndpoint}/links`, {
                params: params,
                withCredentials: true,
            });
            
            console.log('Response data:', response.data);
            setLinksData(response.data.data.links || []);
            setTotalCount(response.data.data.total || 0);
        } catch (error) {
            console.error('Error fetching links:', error);
            console.error('Error response:', error.response?.data);
            setErrors({
                message:
                    error.response?.data?.error || "Unable to fetch links at the moment, please try again",
            });
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortModel, searchTerm, categoryFilter]);

    //Anything mentioned in the dependency array of useEffect will trigger
    //useEffect execution if there is change any value.
    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const columns = [
        { field: "campaignTitle", headerName: "Campaign", flex: 2 },
        {
            field: "originalUrl",
            headerName: "URL",
            flex: 3,
            renderCell: (params) => (
                <a
                    href={`${serverEndpoint}/links/r/${params.row._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {params.row.originalUrl}
                </a>
            ),
        },
        { field: "category", headerName: "Category", flex: 2 },
        { field: "clickCount", headerName: "Clicks", flex: 1 },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
                    {permission.canEditLink && (
                        <IconButton>
                            <EditIcon
                                onClick={() =>
                                    handleModalShow(true, params.row)
                                }
                            />
                        </IconButton>
                    )}

                    {permission.canDeleteLink && (
                        <IconButton>
                            <DeleteIcon
                                onClick={() =>
                                    handleDeleteModalShow(params.row._id)
                                }
                            />
                        </IconButton>
                    )}
                    {permission.canViewLink && (
                        <IconButton>
                            <AssessmentIcon
                                onClick={() => {
                                    navigate(`/analytics/${params.row._id}`);
                                }}
                            />
                        </IconButton>
                    )}
                </>
            ),
        },
        {
            field: "share",
            headerName: "Share Affiliate Link",
            sortable: false,
            flex: 1.5,
            renderCell: (params) => {
                const shareUrl = `${serverEndpoint}/links/r/${params.row._id}`;
                return (
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                            navigator.clipboard.writeText(shareUrl);
                        }}
                    >
                        Copy
                    </button>
                );
            },
        },
    ];

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Manage Affiliate Links</h2>
                    {totalCount > 0 && (
                        <small className="text-muted">
                            {categoryFilter === "all" 
                                ? `Showing ${totalCount} total links`
                                : `Showing ${totalCount} links in "${categoryFilter}" category`
                            }
                        </small>
                    )}
                </div>
                {permission.canCreateLink && (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleModalShow(false)}
                    >
                        Add
                    </button>
                )}
            </div>

            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            <div className="mb-2">
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter campaign title, Original URL, or Category"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-md-4">
                        <select
                            className="form-select"
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary w-100"
                            onClick={clearFilters}
                            title="Clear all filters"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={linksData}
                    columns={columns}
                    pagination
                    paginationMode="server"
                    sortingMode="server"
                    rowCount={totalCount}
                    paginationModel={{
                        page: currentPage,
                        pageSize: pageSize,
                    }}
                    onPaginationModelChange={(model) => {
                        setCurrentPage(model.page);
                        setPageSize(model.pageSize);
                    }}
                    onSortModelChange={(model) => {
                        setSortModel(model);
                    }}
                    sortModel={sortModel}
                    pageSizeOptions={[2, 20, 50, 100]}
                    loading={loading}
                    disableRowSelectionOnClick
                    sx={{
                        fontFamily: "inherit",
                    }}
                />
            </div>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEdit ? <>Edit Link</> : <>Add Link</>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label
                                htmlFor="campaignTitle"
                                className="form-label"
                            >
                                Campaign Title
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.campaignTitle ? "is-invalid" : ""
                                }`}
                                id="campaignTitle"
                                name="campaignTitle"
                                value={formData.campaignTitle}
                                onChange={handleChange}
                            />
                            {errors.campaignTitle && (
                                <div className="invalid-feedback">
                                    {errors.campaignTitle}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="originalUrl" className="form-label">
                                Original URL
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.originalUrl ? "is-invalid" : ""
                                }`}
                                id="originalUrl"
                                name="originalUrl"
                                value={formData.originalUrl}
                                onChange={handleChange}
                            />
                            {errors.originalUrl && (
                                <div className="invalid-feedback">
                                    {errors.originalUrl}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">
                                Category
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.category ? "is-invalid" : ""
                                }`}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            />
                            {errors.category && (
                                <div className="invalid-feedback">
                                    {errors.category}
                                </div>
                            )}
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this link?
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleDeleteModalClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteSubmit}
                    >
                        Delete
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LinkDashboard;