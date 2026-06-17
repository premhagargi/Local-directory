'use client';
// Import Types
import { FullLeadType } from '../types/types';
// Import External Packages
import { useState } from 'react';
// Import Components
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/ui/Select';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/ui/Accordion';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from '@/ui/Dialog';
import { Textarea } from '@/ui/Textarea';
import { Button } from '@/ui/Button';
import Pagination from '@/ui/Pagination';
import { Input } from '@/ui/Input';
import { toast } from '@/lib/useToaster';
import ActionVerificationModal from '@/components/ActionVerificationModal';
// Import Functions & Actions & Hooks & State
import updateLead from '../actions/updateLead';
import deleteLead from '../actions/deleteLead';
import { cn } from '@/lib/utils';
import usePagination from '@/lib/usePagination';
// Import Data
// Import Assets & Icons
import { TrashIcon } from 'lucide-react';

/**
 * A table component that displays leads.
 * @param leads - The leads to display.
 */
export default function LeadTable({ leads }: { leads: FullLeadType[] | null }) {
	const [leadData, setLeadData] = useState<FullLeadType[]>(
		leads === null ? [] : leads
	);

	const [selectedLead, setSelectedLead] = useState<FullLeadType | null>(null);
	const [updatedNote, setUpdatedNote] = useState<string | null | undefined>(
		undefined
	);

	// If you want to change this, also change the options in the database to match. Subapase > table editor > leads > status > 'Edit Column' > 'Constraints', per default: status = ANY (ARRAY['New'::text, 'In Progress'::text, 'Closed'::text])
	const statusSelection = ['New', 'In Progress', 'Closed'];

	const {
		currentData,
		currentPage,
		totalPages,
		itemsPerPage,
		paginateBack,
		paginateFront,
		paginateBackFF,
		paginateFrontFF,
		setItemsPerPage,
		setSearchTerm,
	} = usePagination({
		initialItemsPerPage: 10,
		data: leadData,
		searchField: 'name',
	});

	return (
		<div className="w-full">
			<div className="w-full flex justify-end">
				<Input
					className="w-58"
					placeholder="Search by name..."
					onChange={(e) => setSearchTerm(e.target.value || '')}
				/>
			</div>

			<div className="grid w-full">
				<div className="table table-auto mt-6">
					<div className="table-header-group">
						<div className="table-row text-sm">
							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Name
							</div>

							<div className="hidden md:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Email
							</div>

							<div className="hidden md:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Listing
							</div>

							<div className="hidden md:table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Product
							</div>

							<div className="table-cell h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Message
							</div>

							<div className="hidden md:table-cell w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Status
							</div>
							<div className="table-cell md:hidden w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Actions
							</div>
							<div className="hidden md:table-cell w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Note
							</div>
							<div className="hidden md:table-cell  w-24 h-10 px-2 text-left align-middle font-medium  border-b-2 border-neutral-200">
								Delete
							</div>
						</div>
					</div>
					<div className="table-row-group">
						{currentData
							.sort((a, b) => {
								const nameA = a.status || 'New';
								const nameB = b.status || 'New';
								if (nameA < nameB) {
									return 1;
								}
								if (nameA > nameB) {
									return -1;
								}
								return 0;
							})
							.map((lead) => (
								<div
									key={lead.id}
									className={cn(
										'table-row h-auto',
										lead.status === 'New' && 'bg-green-200',
										lead.status === 'In Progress' && 'bg-blue-200',
										lead.status === 'Closed' && 'bg-slate-200'
									)}
								>
									<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
										{lead.name} <span className="md:hidden">{lead.email}</span>
									</div>
									<div className="hidden md:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
										{lead.email}
									</div>
									<div className="hidden md:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
										{lead.listing_name?.title}
									</div>

									<div className="hidden md:table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
										{lead.sublisting_name?.title || '---'}
									</div>

									<div className="table-cell content-center p-2 text-sm text-muted-foreground overflow-hidden  border-b-2 border-neutral-200">
										{lead.message && lead.message?.length > 50 ? (
											<Accordion type="single" collapsible>
												<AccordionItem value="item-1">
													<AccordionTrigger>
														{lead.message.slice(0, 50)}...
													</AccordionTrigger>
													<AccordionContent>{lead.message}</AccordionContent>
												</AccordionItem>
											</Accordion>
										) : (
											lead.message
										)}
									</div>

									<div className="hidden md:table-cell content-center p-2 border-b-2 border-neutral-200">
										<Select
											value={lead.status || 'New'}
											onValueChange={(value) => {
												updateLead({ id: lead.id, status: value });
												const updatedLeadData = leadData.map((item) =>
													item.id === lead.id
														? { ...item, status: value }
														: item
												);
												setLeadData(updatedLeadData);
												toast({
													title: 'Success!',
													description: 'The status has been updated.',
												});
											}}
										>
											<SelectTrigger className="w-full bg-white">
												<SelectValue placeholder="Select a status" />
											</SelectTrigger>
											<SelectContent>
												{statusSelection.map((status) => (
													<SelectItem key={status} value={status}>
														{status}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="hidden md:table-cell content-center p-2 border-b-2 border-neutral-200">
										<Button
											variant="outline"
											onClick={() => setSelectedLead(lead)}
										>
											Notes
										</Button>
									</div>

									<div className="table-cell md:hidden content-center p-2 border-b-2 border-neutral-200">
										<div className="grid space-y-2">
											<Select
												value={lead.status || 'New'}
												onValueChange={(value) => {
													updateLead({ id: lead.id, status: value });
													const updatedLeadData = leadData.map((item) =>
														item.id === lead.id
															? { ...item, status: value }
															: item
													);
													setLeadData(updatedLeadData);
													toast({
														title: 'Success!',
														description: 'The status has been updated.',
													});
												}}
											>
												<SelectTrigger className="w-full bg-white">
													<SelectValue placeholder="Select a status" />
												</SelectTrigger>
												<SelectContent>
													{statusSelection.map((status) => (
														<SelectItem key={status} value={status}>
															{status}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Button
												variant="outline"
												onClick={() => setSelectedLead(lead)}
											>
												Notes
											</Button>
											<ActionVerificationModal
												data={lead.id}
												executionFunction={deleteLead}
												buttonText=""
												buttonIcon={TrashIcon}
												modalTitle="Delete Lead"
												modalDescription={`Are you sure you want to delete this lead?`}
												modalVerficationWithAnswer={false}
												modalVerificationAnswer="DELETE"
											/>
										</div>
									</div>
									<div className="hidden md:table-cell content-center p-2 border-b-2 border-neutral-200">
										<ActionVerificationModal
											data={lead.id}
											executionFunction={deleteLead}
											buttonText=""
											buttonIcon={TrashIcon}
											modalTitle="Delete Lead"
											modalDescription={`Are you sure you want to delete this lead?`}
											modalVerficationWithAnswer={false}
											modalVerificationAnswer="DELETE"
										/>
									</div>
								</div>
							))}
					</div>
				</div>

				<Pagination
					itemsPerPage={itemsPerPage}
					totalItems={leadData?.length || 0}
					paginateBack={paginateBack}
					paginateFront={paginateFront}
					paginateBackFF={paginateBackFF}
					paginateFrontFF={paginateFrontFF}
					currentPage={currentPage}
					totalPages={totalPages}
					setItemsPerPage={setItemsPerPage}
					pageSizeOptions={[5, 10, 25, 50]}
					nameOfItems="items"
				/>
			</div>
			<Dialog
				open={selectedLead !== null}
				onOpenChange={() => {
					setSelectedLead(null);
					setUpdatedNote(null);
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Notes</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						These notes are for yourself and will not be shared.
					</DialogDescription>

					<Textarea
						value={
							updatedNote !== undefined && updatedNote !== null
								? updatedNote
								: selectedLead?.note || ''
						}
						onChange={(e) => setUpdatedNote(e.target.value)}
						placeholder="Type your message here..."
						className="mt-4"
						rows={4}
					/>
					<DialogFooter>
						<Button
							onClick={async () =>
								selectedLead
									? await updateLead({
											id: selectedLead.id,
											status: selectedLead.status || 'New',
											note: updatedNote || '',
									  }).then(() => {
											const updatedLeadData = leadData.map((item) =>
												item.id === selectedLead.id
													? { ...item, note: updatedNote || '' }
													: item
											);
											setLeadData(updatedLeadData);
											setSelectedLead(null);
											toast({
												title: 'Success!',
												description: 'Your notes have been updated.',
											});
									  })
									: null
							}
							disabled={!selectedLead || updatedNote === selectedLead?.note}
						>
							Update Notes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
