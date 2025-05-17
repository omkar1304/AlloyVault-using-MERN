import React, { useEffect, useState } from "react";
import { PageHeader, PageSubHeader } from "../../../../component/Headers";
import CustomSearch from "../../../../component/CustomSearch";
import CustomTable from "../../../../component/CustomTable";
import getTableColumns from "./getTableColumns";
import AddOptionModal from "../optionComponents/AddOptionModal";
import CustomButton from "../../../../component/CustomButton";
import toast from "react-hot-toast";
import {
  useDeleteOptionMutation,
  useGetOptionsQuery,
  useUpdateOptionFieldMutation,
} from "../../../../redux/api/admin/optionsApiSlice";

const BtType = () => {
  const [query, setQuery] = useState({
    page: 1,
    size: 25,
    type: 8,
  });
  const [isAddOptionModalOpen, setIsAddOptionModalOpen] = useState(false);

  const [updateOptionField, { isLoading: isOptionFieldUpdating }] =
    useUpdateOptionFieldMutation();
  const [deleteOption, { isLoading: isOptionDeleting }] =
    useDeleteOptionMutation();
  const {
    data: options,
    isLoading: isOptionsLoading,
    isError: isErrorInOptions,
    refetch: getOptionsRefetch,
  } = useGetOptionsQuery({ ...query });

  useEffect(() => {
    getOptionsRefetch();
  }, [query]);

  const handleDeleteOption = async (optionId) => {
    try {
      await deleteOption(optionId);
      toast.success("Option deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Couldn't delete the option!");
    }
  };

  const onPageChange = (pageNumber, pageSize) => {
    setQuery({
      ...query,
      page: query?.size !== pageSize ? 1 : pageNumber,
      size: pageSize,
    });
    return;
  };

  const openAddOptionModal = () => {
    setIsAddOptionModalOpen(true);
  };

  const closeAddOptionModal = () => {
    setIsAddOptionModalOpen(false);
  };

  return (
    <div>
      <AddOptionModal
        open={isAddOptionModalOpen}
        onClose={closeAddOptionModal}
        type={8}
      />
      <div className="flex-row-space-between">
        <div>
          <PageHeader>BT Type Options</PageHeader>
          <PageSubHeader>Add and edit BT type options here!</PageSubHeader>
        </div>
        <CustomButton size="large" onClick={openAddOptionModal}>
          Create Option
        </CustomButton>
      </div>
      <CustomSearch
        query={query}
        setQuery={setQuery}
        placeholder="Search by name"
      />
      <CustomTable
        data={options?.options || []}
        total={options?.total}
        page={query?.page}
        size={query?.size}
        isLoading={isOptionsLoading}
        columns={getTableColumns({
          updateOptionField,
          isOptionFieldUpdating,
          handleDeleteOption,
        })}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default BtType;
