"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaRegFileAlt } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";

/* -----------------------------------------------
Reusable Input Component
----------------------------------------------- */
const InputField = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder,
}: {
    label?: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
}) => (
    <div>
        {label && <label className="block text-sm font-medium capitalize">{label}</label>}
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="block w-full rounded-md text-sm outline-none bg-gray-100 border border-gray-200 py-1 px-3 mt-1 focus:ring-1 focus:ring-indigo-400 transition-all"
        />
    </div>
);

/* -----------------------------------------------
Main Component
----------------------------------------------- */
export default function ProjectCreate() {
    const [loading, setLoading] = useState(false);

    const [projectData, setProjectData] = useState({
        clientName: "",
        orderId: "",
        projectType: "",
        projectBudget: "",
        withoutFiverrBudget: "",
        projectConversationfiles: [] as File[],
        projectResourceFiles: [] as File[],
        projectReferences: [""],
        projectFigmas: [""],
        ourDomainDetails: { url: "", userId: "", password: "" },
        clientExistingSite: { url: "", userId: "", password: "" },
        projectDescription: "",
        deliveryDate: "",
    });

    /* -----------------------------------------------
    HANDLERS
    ----------------------------------------------- */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        parent: "ourDomainDetails" | "clientExistingSite"
    ) => {
        const { name, value } = e.target;
        setProjectData((prev) => ({
            ...prev,
            [parent]: { ...prev[parent], [name]: value },
        }));
    };

    const handleArrayChange = (type: "projectReferences" | "projectFigmas", index: number, value: string) => {
        setProjectData((prev) => {
            const arr = [...prev[type]];
            arr[index] = value;
            return { ...prev, [type]: arr };
        });
    };

    const addArrayField = (type: "projectReferences" | "projectFigmas") => {
        setProjectData((prev) => ({ ...prev, [type]: [...prev[type], ""] }));
    };

    const removeArrayField = (type: "projectReferences" | "projectFigmas", index: number) => {
        setProjectData((prev) => {
            const arr = [...prev[type]];
            arr.splice(index, 1);
            return { ...prev, [type]: arr };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: "projectConversationfiles" | "projectResourceFiles") => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setProjectData((prev) => ({ ...prev, [key]: files }));
    };

    /* -----------------------------------------------
    SUBMIT FORM
    ----------------------------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            // Helper: append any field (including nested/arrays)
            const appendFormData = (data: any, parentKey = "") => {
                Object.entries(data).forEach(([key, value]) => {
                    const formKey = parentKey ? `${parentKey}[${key}]` : key;

                    if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (item instanceof File) {
                                formData.append(formKey, item);
                            } else {
                                formData.append(`${formKey}[${index}]`, item);
                            }
                        });
                    } else if (value instanceof File) {
                        formData.append(formKey, value);
                    } else if (typeof value === "object" && value !== null) {
                        appendFormData(value, formKey);
                    } else if (value !== undefined && value !== null) {
                        formData.append(formKey, value as string);
                    }
                });
            };

            // Build form data from your projectData
            appendFormData(projectData);

            // Send request
            const res = await axios.post("/api/project/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(res);
            
            toast.success(res.data.message || "Project created successfully!");
            // location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Project creation failed!");
        } finally {
            setLoading(false);
        }
    };



    /* -----------------------------------------------
    COMPONENT JSX
    ----------------------------------------------- */
    return (
        <div className="flex min-h-screen justify-center items-center flex-col p-6">
            <h1 className="my-4 text-2xl font-semibold text-gray-800">Create New Project</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-gray-200 rounded-xl sm:w-full sm:max-w-2xl p-6 shadow-lg space-y-5"
            >
                <InputField label="Client Name" name="clientName" value={projectData.clientName} placeholder="Client Name" onChange={handleChange} />
                <InputField label="Order ID" name="orderId" value={projectData.orderId} placeholder="Order ID" onChange={handleChange} />

                {/* Project Type */}
                <div>
                    <label className="block text-sm font-medium capitalize">Project Type</label>
                    <select
                        name="projectType"
                        value={projectData.projectType}
                        onChange={handleChange}
                        className="block w-full rounded-md text-sm outline-none bg-gray-100 border border-gray-200 py-1 px-3 mt-1"
                    >
                        <option value="">Select Type</option>
                        <option value="web">Web</option>
                        <option value="graphic">Graphic</option>
                        <option value="figma">Figma</option>
                    </select>
                </div>

                {/* Budgets */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField label="Project Budget" name="projectBudget" type="number" value={projectData.projectBudget} placeholder="$" onChange={handleChange} />
                    <InputField label="Without Fiverr Budget" name="withoutFiverrBudget" type="number" value={projectData.withoutFiverrBudget} placeholder="$" onChange={handleChange} />
                </div>

                {/* File Upload Section */}
                {[
                    { key: "projectConversationfiles", label: "Upload Client Conversation Files", color: "indigo" },
                    { key: "projectResourceFiles", label: "Upload Project Resource Files", color: "green" },
                ].map(({ key, label, color }) => (
                    <div key={key}>
                        <label className="block text-sm font-medium capitalize">{label}</label>
                        <label
                            htmlFor={key}
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer p-6 mt-2 transition-all"
                        >
                            <MdDriveFolderUpload className={`text-${color}-500 text-4xl mb-1`} />
                            <span className="text-sm text-gray-600 font-medium">Click or drag files to upload</span>
                            <span className="text-xs text-gray-400">(Multiple files allowed)</span>
                        </label>

                        <input type="file" id={key} multiple onChange={(e) => handleFileChange(e, key as any)} className="hidden" />

                        {(projectData as any)[key].length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                {(projectData as any)[key].map((file: File, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1">
                                        <FaRegFileAlt className={`text-${color}-500`} />
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}

                {/* Dynamic Links (References & Figmas) */}
                {["projectReferences", "projectFigmas"].map((type) => (
                    <div key={type}>
                        <label className="block text-sm font-medium capitalize">{type === "projectReferences" ? "Project References" : "Figma Links"}</label>
                        {(projectData as any)[type].map((item: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 mt-1">
                                <input
                                    value={item}
                                    onChange={(e) => handleArrayChange(type as any, idx, e.target.value)}
                                    placeholder={`${type === "projectReferences" ? "Reference" : "Figma"} link ${idx + 1}`}
                                    className="block w-full rounded-md bg-gray-100 border border-gray-200 py-1 px-3 text-sm"
                                />
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeArrayField(type as any, idx)}
                                        className="text-red-500 font-bold text-sm"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addArrayField(type as any)}
                            className="text-indigo-600 text-sm mt-2 cursor-pointer"
                        >
                            + Add another
                        </button>
                    </div>
                ))}

                {/* Domain Details */}
                {[
                    { key: "ourDomainDetails", title: "Our Domain Details" },
                    { key: "clientExistingSite", title: "Client Existing Site" },
                ].map(({ key, title }) => (
                    <div key={key} className="border border-gray-200 p-3 rounded-md space-y-2 mt-4">
                        <p className="font-medium text-gray-700">{title}</p>
                        {["url", "userId", "password"].map((field) => (
                            <InputField
                                key={field}
                                name={field}
                                type={field === "password" ? "password" : "text"}
                                value={(projectData as any)[key][field]}
                                onChange={(e) => handleNestedChange(e, key as any)}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            />
                        ))}
                    </div>
                ))}

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium">Project Description</label>
                    <textarea
                        name="projectDescription"
                        value={projectData.projectDescription}
                        onChange={handleChange}
                        placeholder="Brief project overview..."
                        rows={3}
                        className="block w-full rounded-md bg-gray-100 border border-gray-200 py-1 px-3 text-sm outline-none mt-1"
                    />
                </div>

                {/* Delivery Date */}
                <InputField
                    label="Delivery Date"
                    name="deliveryDate"
                    type="date"
                    value={projectData.deliveryDate}
                    onChange={handleChange}
                />

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-all"
                >
                    {loading ? "Creating..." : "Create Project"}
                </button>
            </form>
        </div>
    );
}
