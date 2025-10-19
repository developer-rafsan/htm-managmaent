"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaRegFileAlt } from "react-icons/fa";
import { MdDriveFolderUpload } from "react-icons/md";

export default function ProjectCreate() {
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState({
        clientName: "",
        orderId: "",
        projectType: "",
        projectStatus: "pending",
        projectBudget: "",
        withoutFiverrBudget: "",
        files: [] as File[],
        projectResourceFiles: [] as File[],
        projectReferences: [""],
        projectFigmas: [""],
        ourDomainDetails: { url: "", userId: "", password: "" },
        clientExistingSite: { url: "", userId: "", password: "" },
        deliveryDate: "",
    });

    // Generic input handler
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setProjectData({ ...projectData, [name]: value });
    };

    // Nested object handler
    const handleNestedChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        parentKey: "ourDomainDetails" | "clientExistingSite"
    ) => {
        const { name, value } = e.target;
        setProjectData({
            ...projectData,
            [parentKey]: {
                ...projectData[parentKey],
                [name]: value,
            },
        });
    };

    // File handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setProjectData({ ...projectData, files });
    };

    const handleFileChangeresorce = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setProjectData({ ...projectData, projectResourceFiles: files });
    };

    // Multiple Project Reference fields
    const handleReferenceChange = (index: number, value: string) => {
        const updatedRefs = [...projectData.projectReferences];
        updatedRefs[index] = value;
        setProjectData({ ...projectData, projectReferences: updatedRefs });
    };

    const addReferenceField = () => {
        setProjectData({
            ...projectData,
            projectReferences: [...projectData.projectReferences, ""],
        });
    };

    const removeReferenceField = (index: number) => {
        const updatedRefs = [...projectData.projectReferences];
        updatedRefs.splice(index, 1);
        setProjectData({ ...projectData, projectReferences: updatedRefs });
    };

    // Multiple Figma fields
    const handleFigmaChange = (index: number, value: string) => {
        const updatedFigmas = [...projectData.projectFigmas];
        updatedFigmas[index] = value;
        setProjectData({ ...projectData, projectFigmas: updatedFigmas });
    };

    const addFigmaField = () => {
        setProjectData({
            ...projectData,
            projectFigmas: [...projectData.projectFigmas, ""],
        });
    };

    const removeFigmaField = (index: number) => {
        const updatedFigmas = [...projectData.projectFigmas];
        updatedFigmas.splice(index, 1);
        setProjectData({ ...projectData, projectFigmas: updatedFigmas });
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("/api/project/create", projectData);
            toast.success(res.data.message || "Project created successfully!");
            location.reload();
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Create failed";
                toast.error(message);
            } else {
                toast.error("Create failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen justify-center items-center flex-col p-6">
            <h1 className="my-4 text-xl font-semibold">Create New Project</h1>

            <div className="bg-white border border-gray-200 rounded-lg sm:w-full sm:max-w-2xl p-6 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Client Name */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Client Name
                        </label>
                        <input
                            name="clientName"
                            value={projectData.clientName}
                            onChange={handleChange}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                            placeholder="Client Name"
                        />
                    </div>

                    {/* Order ID */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Order ID
                        </label>
                        <input
                            name="orderId"
                            value={projectData.orderId}
                            onChange={handleChange}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                            placeholder="Order ID"
                        />
                    </div>

                    {/* Project Type */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Project Type
                        </label>
                        <select
                            name="projectType"
                            value={projectData.projectType}
                            onChange={handleChange}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                        >
                            <option value="">Select Type</option>
                            <option value="web">Web</option>
                            <option value="graphic">Graphic</option>
                            <option value="figma">Figma</option>
                        </select>
                    </div>

                    {/* Budgets */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm/6 font-medium capitalize">
                                Project Budget
                            </label>
                            <input
                                type="number"
                                name="projectBudget"
                                value={projectData.projectBudget}
                                onChange={handleChange}
                                className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 pl-6 mt-1"
                            />
                            <span className="absolute top-8 left-3 text-gray-400">$</span>
                        </div>

                        <div className="relative">
                            <label className="block text-sm/6 font-medium capitalize">
                                Without Fiverr Budget
                            </label>
                            <input
                                type="number"
                                name="withoutFiverrBudget"
                                value={projectData.withoutFiverrBudget}
                                onChange={handleChange}
                                className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 pl-6 mt-1"
                            />
                            <span className="absolute top-8 left-3 text-gray-400">$</span>
                        </div>
                    </div>

                    {/* Client Conversation Files */}
                    <div>
                        <label
                            className="block text-sm/6 font-medium capitalize"
                        >
                            Upload Client Conversation Files
                        </label>

                        <label
                            htmlFor="conversation"
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer p-6 mt-2"
                        >
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <MdDriveFolderUpload className="text-indigo-500 text-4xl" />
                                <span className="text-sm text-gray-600 font-medium">
                                    Click or drag files to upload
                                </span>
                                <span className="text-xs text-gray-400">
                                    (You can select multiple files)
                                </span>
                            </div>
                        </label>

                        <input
                            type="file"
                            id="conversation"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {projectData.files.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                {projectData.files.map((file, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1"
                                    >
                                        <FaRegFileAlt />
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Project Resource Files */}
                    <div>
                        <label
                            className="block text-sm/6 font-medium capitalize"
                        >
                            Upload Project Resource Files
                        </label>

                        <label
                            htmlFor="projectResource"
                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer p-6 mt-2"
                        >
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <MdDriveFolderUpload className="text-green-500 text-4xl mb-1" />
                                <span className="text-sm text-gray-600 font-medium">
                                    Click or drag files to upload project resources
                                </span>
                                <span className="text-xs text-gray-400">
                                    (You can select multiple files)
                                </span>
                            </div>
                        </label>

                        <input
                            type="file"
                            id="projectResource"
                            name="projectResource"
                            multiple
                            onChange={handleFileChangeresorce}
                            className="hidden"
                        />

                        {projectData.projectResourceFiles.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm text-gray-700">
                                {projectData.projectResourceFiles.map((file, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1"
                                    >
                                        <FaRegFileAlt className="text-green-500" />
                                        {file.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Multiple Project References */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Project Reference
                        </label>
                        {projectData.projectReferences.map((ref, idx) => (
                            <div key={idx} className="flex items-center gap-2 mt-1">
                                <input
                                    value={ref}
                                    onChange={(e) =>
                                        handleReferenceChange(idx, e.target.value)
                                    }
                                    className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                                    placeholder={`Reference link ${idx + 1}`}
                                />
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeReferenceField(idx)}
                                        className="text-red-500 text-sm font-bold cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addReferenceField}
                            className="text-indigo-600 text-sm mt-2 cursor-pointer"
                        >
                            + Add another reference
                        </button>
                    </div>

                    {/* Multiple Figma Links */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Project Figma
                        </label>
                        {projectData.projectFigmas.map((fig, idx) => (
                            <div key={idx} className="flex items-center gap-2 mt-1">
                                <input
                                    value={fig}
                                    onChange={(e) => handleFigmaChange(idx, e.target.value)}
                                    className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                                    placeholder={`Figma link ${idx + 1}`}
                                />
                                {idx > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeFigmaField(idx)}
                                        className="text-red-500 text-sm font-bold cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addFigmaField}
                            className="text-indigo-600 text-sm mt-2 cursor-pointer"
                        >
                            + Add another figma link
                        </button>
                    </div>

                    {/* Domain Details */}
                    <div className="border border-gray-200 p-3 rounded-md mt-4 space-y-2">
                        <p className="font-medium mb-2">Our Domain Details</p>
                        <input
                            name="url"
                            placeholder="URL"
                            value={projectData.ourDomainDetails.url}
                            onChange={(e) => handleNestedChange(e, "ourDomainDetails")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                        <input
                            name="userId"
                            placeholder="User ID"
                            value={projectData.ourDomainDetails.userId}
                            onChange={(e) => handleNestedChange(e, "ourDomainDetails")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={projectData.ourDomainDetails.password}
                            onChange={(e) => handleNestedChange(e, "ourDomainDetails")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                    </div>

                    {/* Client Existing Site */}
                    <div className="border border-gray-200  p-3 rounded-md mt-4 space-y-2">
                        <p className="font-medium mb-2">Client Existing Site</p>
                        <input
                            name="url"
                            placeholder="URL"
                            value={projectData.clientExistingSite.url}
                            onChange={(e) => handleNestedChange(e, "clientExistingSite")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                        <input
                            name="userId"
                            placeholder="User ID"
                            value={projectData.clientExistingSite.userId}
                            onChange={(e) => handleNestedChange(e, "clientExistingSite")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                        <input
                            name="password"
                            placeholder="Password"
                            type="password"
                            value={projectData.clientExistingSite.password}
                            onChange={(e) => handleNestedChange(e, "clientExistingSite")}
                            className="block w-full rounded-md text-base outline-none bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3"
                        />
                    </div>

                    {/* Delivery Date */}
                    <div>
                        <label className="block text-sm/6 font-medium capitalize">
                            Delivery Date
                        </label>
                        <input
                            type="date"
                            name="deliveryDate"
                            value={projectData.deliveryDate}
                            onChange={handleChange}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 flex justify-center rounded-md bg-indigo-600 text-sm font-semibold text-white py-2 px-4 w-full"
                    >
                        {loading ? "Creating..." : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}
